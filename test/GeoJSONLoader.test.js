import assert from 'node:assert/strict';
import { test } from 'node:test';
import { GeoJSONLoader } from '../src/GeoJSONLoader.js';

test( 'merged lines retain one material group per input geometry', () => {

	const { lines } = new GeoJSONLoader().parse( {
		type: 'GeometryCollection',
		geometries: [
			{ type: 'LineString', coordinates: [[ 0, 0 ], [ 1, 0 ], [ 2, 0 ]] },
			{
				type: 'MultiLineString',
				coordinates: [[[ 0, 1 ], [ 1, 1 ]], [[ 0, 2 ], [ 1, 2 ], [ 2, 2 ]]],
			},
		],
	} );
	const merged = GeoJSONLoader.getLineObject( lines );

	assert.deepEqual( merged.geometry.groups, [
		{ start: 0, count: 4, materialIndex: 0 },
		{ start: 4, count: 6, materialIndex: 1 },
	] );
	assert.equal( merged.geometry.attributes.position.count, 10 );

} );

test( 'polygon rings and multipart geometries share their input material', () => {

	const { geometries } = new GeoJSONLoader().parse( {
		type: 'GeometryCollection',
		geometries: [
			{
				type: 'Polygon',
				coordinates: [
					[[ 0, 0 ], [ 4, 0 ], [ 4, 4 ], [ 0, 4 ], [ 0, 0 ]],
					[[ 1, 1 ], [ 1, 2 ], [ 2, 2 ], [ 2, 1 ], [ 1, 1 ]],
				],
			},
			{ type: 'LineString', coordinates: [[ 5, 0 ], [ 5, 4 ]] },
			{
				type: 'MultiPolygon',
				coordinates: [
					[[[ 6, 0 ], [ 8, 0 ], [ 7, 2 ], [ 6, 0 ]]],
					[[[ 6, 3 ], [ 8, 3 ], [ 7, 5 ], [ 6, 3 ]]],
				],
			},
		],
	} );
	const merged = GeoJSONLoader.getLineObject( geometries );

	assert.deepEqual( merged.geometry.groups, [
		{ start: 0, count: 16, materialIndex: 0 },
		{ start: 16, count: 2, materialIndex: 1 },
		{ start: 18, count: 12, materialIndex: 2 },
	] );
	assert.equal( merged.geometry.attributes.position.count, 30 );

} );

test( 'material group ranges use the resampled line lengths', () => {

	const { lines } = new GeoJSONLoader().parse( {
		type: 'MultiLineString',
		coordinates: [[[ 0, 0 ], [ 3, 0 ]], [[ 0, 1 ], [ 2, 1 ]]],
	} );
	const merged = GeoJSONLoader.getLineObject( lines, { resolution: 1, offset: 5 } );

	assert.deepEqual( merged.geometry.groups, [
		{ start: 0, count: 10, materialIndex: 0 },
	] );
	assert.equal( merged.geometry.attributes.position.count, 10 );
	assert.equal( merged.position.z, 5 );

} );
