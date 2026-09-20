<!-- This file is generated automatically. Do not edit it directly. -->
# three-geojson

## GeoJSONLoader

Loader and parser for the [GeoJSON](https://geojson.org/) format.


### static .getLineObject

```js
static getLineObject(
	objects: Array<(Polygon|LineString)>,
	options: LineOptions
): LineSegments
```

Returns a line that merges the result of all the provided Polygons and LineStrings. Each
result is defined as a separate group in the resulting geometry.


### static .getMeshObject

```js
static getMeshObject( objects: Array<Polygon>, options: MeshOptions ): Mesh
```

Returns a mesh that merges the result of all the provided Polygons. Each result is defined as
a separate group in the resulting geometry in top cap, bottom cap, side geometry order.


### .fetchOptions

```js
fetchOptions: Object = {}
```

Options passed to `fetch` when loading a file.


### .loadAsync

```js
loadAsync( url: string ): Promise<GeoJSONResult>
```

Loads and parses a GeoJSON file.


### .parse

```js
parse( json: string | Object ): GeoJSONResult
```

Parses GeoJSON content. Takes a raw or stringified json object.


## WKTLoader

_extends [`GeoJSONLoader`](#geojsonloader)_

Loader and parser for the
[WKT](https://en.wikipedia.org/wiki/Well-known_text_representation_of_geometry) format. The
contents are converted to GeoJSON using the
[betterknown](https://github.com/placemark/betterknown) package and then parsed with the
GeoJSONLoader parse function.


### .loadAsync

```js
loadAsync( url: string ): Promise<GeoJSONResult>
```

Loads and parses a WKT file.


### .parse

```js
parse( text: string ): GeoJSONResult
```

Parses WKT content.


## Feature

Definition of a feature that includes properties originally defined in the GeoJSON file.


### .type

```js
type: string
```

Always "Feature".

### .id

```js
id: string | null
```

The feature id, or null if not present.

### .properties

```js
properties: Object
```

The properties defined on the feature.

### .boundingBox

```js
boundingBox: Box3 | null
```

The "bbox" field parsed into a Box3, or null if not present.

### .foreign

```js
foreign: Object
```

Any non-schema fields found on the original GeoJSON object.

### .geometries

```js
geometries: Array<(Points|LineString|Polygon)>
```

The list of all geometries in
  the feature.

### .points

```js
points: Array<Points>
```

The point geometries in the feature.

### .lines

```js
lines: Array<LineString>
```

The line geometries in the feature.

### .polygons

```js
polygons: Array<Polygon>
```

The polygon geometries in the feature.

## GeoJSONResult

The set of features and geometries parsed out of a file.


### .features

```js
features: Array<Feature>
```

The list of features in the file.

### .geometries

```js
geometries: Array<(Points|LineString|Polygon)>
```

The list of all geometries in the file.

### .points

```js
points: Array<Points>
```

The point geometries in the file.

### .lines

```js
lines: Array<LineString>
```

The line geometries in the file.

### .polygons

```js
polygons: Array<Polygon>
```

The polygon geometries in the file.

## LineOptions

Options used when generating line geometry.


### .offset

```js
offset = 0: number
```

The offset of the generated geometry on the z axis.

### .altitudeScale

```js
altitudeScale = 1: number
```

A value to scale the GeoJSON-embedded altitude values by.
  The "offset" option value is not multiplied by this.

### .flat

```js
flat = false: boolean
```

If "true" then any altitude or z-values are ignored.

### .ellipsoid

```js
ellipsoid = null: Ellipsoid | null
```

The ellipsoid to use to project the generated
  geometry onto a globe surface. If no ellipsoid is provided then no projection is done. The
  class need only be shaped like the one from the 3d-tiles-renderer project.

### .resolution

```js
resolution = null: number | null
```

The spacing to use when resampling edges. Useful when
  projecting a geometry to an ellipsoid surface and more geometry detail is needed for the
  curvature. If set to "null" then no resampling is done.

## LineString

Definition of a parsed set of line string geometry.


### .type

```js
type: string
```

The GeoJSON geometry type, "LineString" or "MultiLineString".

### .feature

```js
feature: Feature | null
```

The feature the geometry was defined in, if any.

### .boundingBox

```js
boundingBox: Box3 | null
```

The "bbox" field parsed into a Box3, or null if not present.

### .foreign

```js
foreign: Object
```

Any non-schema fields found on the original GeoJSON object.

### .dimension

```js
dimension: number | null
```

The number of components in each coordinate.

### .data

```js
data: Array<Array<Position>>
```

The set of parsed line strings.

### .getLineObject

```js
getLineObject: function
```

Builds a three.js LineSegments
  from the line data.

## MeshOptions

Options used when generating polygon mesh geometry, in addition to those used for lines.


### .offset

```js
offset = 0: number
```

The offset of the generated geometry on the z axis.

### .altitudeScale

```js
altitudeScale = 1: number
```

A value to scale the GeoJSON-embedded altitude values by.
  The "offset" option value is not multiplied by this.

### .flat

```js
flat = false: boolean
```

If "true" then any altitude or z-values are ignored.

### .ellipsoid

```js
ellipsoid = null: Ellipsoid | null
```

The ellipsoid to use to project the generated
  geometry onto a globe surface. If no ellipsoid is provided then no projection is done. The
  class need only be shaped like the one from the 3d-tiles-renderer project.

### .resolution

```js
resolution = null: number | null
```

The spacing to use when generating internal points and
  edge resampling for triangulation. Useful when projecting a geometry to an ellipsoid surface
  and more geometry detail is needed for the curvature. If set to "null" then no resampling
  is done.

### .thickness

```js
thickness = 0: number
```

The thickness of the generated geometry on the z axis.

### .useEarcut

```js
useEarcut = false: boolean
```

Whether to use the "earcut" algorithm rather than delaunay
  for performance. Note that this can result in some cases where triangles do not have
  sibling edges.

### .detectSelfIntersection

```js
detectSelfIntersection = true: boolean
```

Whether to perform self polygon intersection
  checks and split polygons at intersections. Can be disabled when a data set is known to be
  well-formed to improve performance.

## Points

Definition of a parsed set of point geometry.


### .type

```js
type: string
```

The GeoJSON geometry type, "Point" or "MultiPoint".

### .feature

```js
feature: Feature | null
```

The feature the geometry was defined in, if any.

### .boundingBox

```js
boundingBox: Box3 | null
```

The "bbox" field parsed into a Box3, or null if not present.

### .foreign

```js
foreign: Object
```

Any non-schema fields found on the original GeoJSON object.

### .dimension

```js
dimension: number | null
```

The number of components in each coordinate.

### .data

```js
data: Array<Position>
```

The set of parsed points.

## Polygon

Definition of a parsed set of polygon geometry.


### .type

```js
type: string
```

The GeoJSON geometry type, "Polygon" or "MultiPolygon".

### .feature

```js
feature: Feature | null
```

The feature the geometry was defined in, if any.

### .boundingBox

```js
boundingBox: Box3 | null
```

The "bbox" field parsed into a Box3, or null if not present.

### .foreign

```js
foreign: Object
```

Any non-schema fields found on the original GeoJSON object.

### .dimension

```js
dimension: number | null
```

The number of components in each coordinate.

### .data

```js
data: Array<Array<Array<Position>>>
```

The set of parsed polygons, each defined as a contour loop
  followed by any hole loops.

### .getLineObject

```js
getLineObject: function
```

Builds a three.js LineSegments
  from the polygon loops.

### .getMeshObject

```js
getMeshObject: function
```

Builds a three.js Mesh from the
  polygon data.

## Position

_extends `Array.<number>`_

A single GeoJSON coordinate, stored as `[ longitude, latitude ]` or
`[ longitude, latitude, altitude ]`.

