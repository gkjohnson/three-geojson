import { GeoJSONLoader } from './GeoJSONLoader.js';
import { wktToGeoJSON } from "betterknown";
/** @import { GeoJSONResult } from './GeoJSONLoader.js' */

/**
 * Loader and parser for the
 * [WKT](https://en.wikipedia.org/wiki/Well-known_text_representation_of_geometry) format. The
 * contents are converted to GeoJSON using the
 * [betterknown](https://github.com/placemark/betterknown) package and then parsed with the
 * GeoJSONLoader parse function.
 * @extends GeoJSONLoader
 */
export class WKTLoader extends GeoJSONLoader {

	/**
	 * Loads and parses a WKT file.
	 * @param {string} url
	 * @returns {Promise<GeoJSONResult>}
	 */
	loadAsync( url ) {

		return fetch( url )
			.then( res => res.text() )
			.then( json => this.parse( json ) );

	}

	/**
	 * Parses WKT content.
	 * @param {string} text
	 * @returns {GeoJSONResult}
	 */
	parse( text ) {

		return super.parse( wktToGeoJSON( text ) );

	}

}
