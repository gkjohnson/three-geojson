import { getDimension, extractForeignKeys, traverse } from './GeoJSONShapeUtils.js';
import { parseBounds } from './ParseUtils.js';
import { constructLineObject } from './constructLineObject.js';
import { constructPolygonMeshObject } from './constructPolygonMeshObject.js';
/** @import { Box3, LineSegments, Mesh } from 'three' */
/** @import { Ellipsoid } from '3d-tiles-renderer' */

/**
 * A single GeoJSON coordinate, stored as `[ longitude, latitude ]` or
 * `[ longitude, latitude, altitude ]`.
 * @typedef {number[]} Position
 */

/**
 * Options used when generating line geometry.
 * @typedef {Object} LineOptions
 * @property {number} [offset=0] The offset of the generated geometry on the z axis.
 * @property {number} [altitudeScale=1] A value to scale the GeoJSON-embedded altitude values by.
 *   The "offset" option value is not multiplied by this.
 * @property {boolean} [flat=false] If "true" then any altitude or z-values are ignored.
 * @property {Ellipsoid|null} [ellipsoid=null] The ellipsoid to use to project the generated
 *   geometry onto a globe surface. If no ellipsoid is provided then no projection is done. The
 *   class need only be shaped like the one from the 3d-tiles-renderer project.
 * @property {number|null} [resolution=null] The spacing to use when resampling edges. Useful when
 *   projecting a geometry to an ellipsoid surface and more geometry detail is needed for the
 *   curvature. If set to "null" then no resampling is done.
 */

/**
 * Options used when generating polygon mesh geometry, in addition to those used for lines.
 * @typedef {Object} MeshOptions
 * @property {number} [offset=0] The offset of the generated geometry on the z axis.
 * @property {number} [altitudeScale=1] A value to scale the GeoJSON-embedded altitude values by.
 *   The "offset" option value is not multiplied by this.
 * @property {boolean} [flat=false] If "true" then any altitude or z-values are ignored.
 * @property {Ellipsoid|null} [ellipsoid=null] The ellipsoid to use to project the generated
 *   geometry onto a globe surface. If no ellipsoid is provided then no projection is done. The
 *   class need only be shaped like the one from the 3d-tiles-renderer project.
 * @property {number|null} [resolution=null] The spacing to use when generating internal points and
 *   edge resampling for triangulation. Useful when projecting a geometry to an ellipsoid surface
 *   and more geometry detail is needed for the curvature. If set to "null" then no resampling
 *   is done.
 * @property {number} [thickness=0] The thickness of the generated geometry on the z axis.
 * @property {boolean} [useEarcut=false] Whether to use the "earcut" algorithm rather than delaunay
 *   for performance. Note that this can result in some cases where triangles do not have
 *   sibling edges.
 * @property {boolean} [detectSelfIntersection=true] Whether to perform self polygon intersection
 *   checks and split polygons at intersections. Can be disabled when a data set is known to be
 *   well-formed to improve performance.
 */

/**
 * Definition of a parsed set of point geometry.
 * @typedef {Object} Points
 * @property {string} type The GeoJSON geometry type, "Point" or "MultiPoint".
 * @property {Feature|null} feature The feature the geometry was defined in, if any.
 * @property {Box3|null} boundingBox The "bbox" field parsed into a Box3, or null if not present.
 * @property {Object} foreign Any non-schema fields found on the original GeoJSON object.
 * @property {number|null} dimension The number of components in each coordinate.
 * @property {Position[]} data The set of parsed points.
 */

/**
 * Definition of a parsed set of line string geometry.
 * @typedef {Object} LineString
 * @property {string} type The GeoJSON geometry type, "LineString" or "MultiLineString".
 * @property {Feature|null} feature The feature the geometry was defined in, if any.
 * @property {Box3|null} boundingBox The "bbox" field parsed into a Box3, or null if not present.
 * @property {Object} foreign Any non-schema fields found on the original GeoJSON object.
 * @property {number|null} dimension The number of components in each coordinate.
 * @property {Position[][]} data The set of parsed line strings.
 * @property {function(LineOptions): LineSegments} getLineObject Builds a three.js LineSegments
 *   from the line data.
 */

/**
 * Definition of a parsed set of polygon geometry.
 * @typedef {Object} Polygon
 * @property {string} type The GeoJSON geometry type, "Polygon" or "MultiPolygon".
 * @property {Feature|null} feature The feature the geometry was defined in, if any.
 * @property {Box3|null} boundingBox The "bbox" field parsed into a Box3, or null if not present.
 * @property {Object} foreign Any non-schema fields found on the original GeoJSON object.
 * @property {number|null} dimension The number of components in each coordinate.
 * @property {Position[][][]} data The set of parsed polygons, each defined as a contour loop
 *   followed by any hole loops.
 * @property {function(LineOptions): LineSegments} getLineObject Builds a three.js LineSegments
 *   from the polygon loops.
 * @property {function(MeshOptions): Mesh} getMeshObject Builds a three.js Mesh from the
 *   polygon data.
 */

/**
 * Definition of a feature that includes properties originally defined in the GeoJSON file.
 * @typedef {Object} Feature
 * @property {string} type Always "Feature".
 * @property {string|null} id The feature id, or null if not present.
 * @property {Object} properties The properties defined on the feature.
 * @property {Box3|null} boundingBox The "bbox" field parsed into a Box3, or null if not present.
 * @property {Object} foreign Any non-schema fields found on the original GeoJSON object.
 * @property {Array<Points|LineString|Polygon>} geometries The list of all geometries in
 *   the feature.
 * @property {Points[]} points The point geometries in the feature.
 * @property {LineString[]} lines The line geometries in the feature.
 * @property {Polygon[]} polygons The polygon geometries in the feature.
 */

/**
 * The set of features and geometries parsed out of a file.
 * @typedef {Object} GeoJSONResult
 * @property {Feature[]} features The list of features in the file.
 * @property {Array<Points|LineString|Polygon>} geometries The list of all geometries in the file.
 * @property {Points[]} points The point geometries in the file.
 * @property {LineString[]} lines The line geometries in the file.
 * @property {Polygon[]} polygons The polygon geometries in the file.
 */

// Get the base object definition for GeoJSON type
function getBase( object ) {

	return {
		type: object.type,
		boundingBox: parseBounds( object.bbox ),
		data: null,
		foreign: extractForeignKeys( object ),
	};

}

// Shape construction functions
function getLineObject( options = {} ) {

	return constructLineObject( this.data, options );


}

function getPolygonLineObject( options = {} ) {

	return constructLineObject( this.data.flatMap( shape => shape ), options );

}

function getPolygonMeshObject( options ) {

	return constructPolygonMeshObject( this.data, options );

}

/**
 * Loader and parser for the [GeoJSON](https://geojson.org/) format.
 */
export class GeoJSONLoader {

	/**
	 * Returns a line that merges the result of all the provided Polygons and LineStrings. Each
	 * result is defined as a separate group in the resulting geometry.
	 * @param {Array<Polygon|LineString>} objects
	 * @param {LineOptions} [options]
	 * @returns {LineSegments}
	 */
	static getLineObject( objects, options ) {

		const lines = [];
		const groups = [];
		objects.forEach( o => {

			if ( /LineString/.test( o.type ) ) {

				lines.push( ...o.data );
				groups.push( o.data.length );

			} else if ( /Polygon/.test( o.type ) ) {

				const shapes = o.data.flatMap( shape => shape );
				lines.push( ...shapes );
				groups.push( shapes.length );

			}

		} );

		return constructLineObject( lines, {
			...options,
			groups: [],
	 	} );

	}

	/**
	 * Returns a mesh that merges the result of all the provided Polygons. Each result is defined as
	 * a separate group in the resulting geometry in top cap, bottom cap, side geometry order.
	 * @param {Polygon[]} objects
	 * @param {MeshOptions} [options]
	 * @returns {Mesh}
	 */
	static getMeshObject( objects, options ) {

		// TODO: support cap / edges group generation. Requires groups caps and edges for each individual geometry together
		const polygons = [];
		const groups = [];
		objects.forEach( o => {

			if ( /Polygon/.test( o.type ) ) {

				const shapes = o.data;
				polygons.push( ...shapes );
				groups.push( shapes.length );

			}

		} );

		return constructPolygonMeshObject( polygons, {
			...options,
			groups,
	 	} );

	}

	constructor() {

		/**
		 * Options passed to `fetch` when loading a file.
		 * @type {Object}
		 * @default {}
		 */
		this.fetchOptions = {};

	}

	/**
	 * Loads and parses a GeoJSON file.
	 * @param {string} url
	 * @returns {Promise<GeoJSONResult>}
	 */
	loadAsync( url ) {

		return fetch( url, this.fetchOptions )
			.then( res => res.json() )
			.then( json => this.parse( json ) );

	}

	/**
	 * Parses GeoJSON content. Takes a raw or stringified json object.
	 * @param {string|Object} json
	 * @returns {GeoJSONResult}
	 */
	parse( json ) {

		if ( typeof json === 'string' ) {

			json = JSON.parse( json );

		}

		const root = this.parseObject( json );
		const features = [];
		const geometries = [];

		// find all features and geometries
		traverse( root, object => {

			if ( object.type !== 'FeatureCollection' && object.type !== 'GeometryCollection' ) {

				if ( object.type === 'Feature' ) {

					features.push( object );

				} else {

					geometries.push( object );

					if ( object.feature ) {

						object.feature.geometries.push( object );

					}

				}

			}

		} );

		// collect all shapes within each feature
		features.forEach( feature => {

			const { geometries } = feature;
			feature.points = geometries.filter( object => /Point/.test( object.type ) );
			feature.lines = geometries.filter( object => /Line/.test( object.type ) );
			feature.polygons = geometries.filter( object => /Polygon/.test( object.type ) );

		} );

		return {
			features,
			geometries,
			points: geometries.filter( object => /Point/.test( object.type ) ),
			lines: geometries.filter( object => /Line/.test( object.type ) ),
			polygons: geometries.filter( object => /Polygon/.test( object.type ) ),
		};

	}

	parseObject( object, feature = null ) {

		switch ( object.type ) {

			case 'Point': {

				return {
					...getBase( object ),
					feature,
					data: [ object.coordinates ],
					dimension: getDimension( object.coordinates ),
				};

			}

			case 'MultiPoint': {

				return {
					...getBase( object ),
					feature,
					data: object.coordinates,
					dimension: getDimension( object.coordinates[ 0 ] ),
				};

			}

			case 'LineString': {

				return {
					...getBase( object ),
					feature,
					data: [ object.coordinates ],
					dimension: getDimension( object.coordinates[ 0 ] ),

					getLineObject,
				};

			}

			case 'MultiLineString': {

				return {
					...getBase( object ),
					feature,
					data: object.coordinates,
					dimension: getDimension( object.coordinates[ 0 ][ 0 ] ),

					getLineObject,
				};

			}

			case 'Polygon': {

				return {
					...getBase( object ),
					feature,
					data: [ object.coordinates ],
					dimension: getDimension( object.coordinates[ 0 ][ 0 ] ),

					getLineObject: getPolygonLineObject,
					getMeshObject: getPolygonMeshObject,
				};

			}

			case 'MultiPolygon': {

				return {
					...getBase( object ),
					feature,
					data: object.coordinates,
					dimension: getDimension( object.coordinates[ 0 ][ 0 ][ 0 ] ),

					getLineObject: getPolygonLineObject,
					getMeshObject: getPolygonMeshObject,
				};

			}

			case 'GeometryCollection': {

				return {
					...getBase( object ),
					feature,
					data: object.geometries.map( obj => this.parseObject( obj, feature ) ),
				};

			}

			case 'Feature': {

				const feature = {
					...getBase( object ),
					id: object.id ?? null,
					properties: object.properties,
					geometries: [],
					data: null,
				};

				feature.data = this.parseObject( object.geometry, feature );
				return feature;

			}

			case 'FeatureCollection': {

				return {
					...getBase( object ),
					data: object.features.map( feat => this.parseObject( feat ) ),
				};

			}

		}

	}

}
