# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## [0.0.13] - 2026.09.20
### Fixed
- "fetchOptions" not being passed to fetch when loading a file.

## [0.0.12] - 2025-07.01
## Added
- static GeoJSONLoader.getMeshObject and getLineObject functions.

## [0.0.11] - 2025.06.27
### Fixed
- Fixed "LineStrings" geometry not being generated correctly.

## [0.0.10] - 2025.06.12
### Added
- Added support for "altitudeScale" when generating geometry.

## [0.0.9] - 2025.05.21
### Fixed
- Corrected incorrectly specified `@__PURE__` annotations.

## [0.0.8] - 2025.05.18
### Fixed
- Cases where polygon hole were not created properly when "detectSelfIntersection" was true.

## [0.0.7] - 2025.05.18
### Fixed
- Error that could be thrown the processing polygons.

### Changed
- Removed "generateNormals" option.

### Added
- Support for the "resolution" option to resample edges and lines.
- Support for smooth normals with ellipsoid tiles.
- Support for upsampling vertex detail in polygons to enable correctly distorted ellipsoid shapes.
- `useEarcut` and `skipSelfIntersection` options to optionally speed up performance.

## [0.0.6] - 2025.05.16
### Fixed
- Fixed case where points created from polygon crossing were always placed at "0".
- Fixed some precision issues associated with the polygon generation.

## [0.0.5] - 2025.05.14
### Fixed
- Fixed case where shapes with less than 4 vertices after vertex deduplication would not triangulate.

### Changed
- Removed GeoJSONEllipsoidTransformer in favor of object getter ellipsoid option.
- Removed "decomposePolygons" option.

## [0.0.4] - 2025.05.14
### Added
- "offset" option when generating line objects.
- GeoJSONEllipsoidTransformer: Add "transformObject" function tht offset the root mesh to avoid precision artifacts in render.

### Fixed
- Replaced "wellknown" with "betterknown" package for WKT parsing for improved support.
- Add fix for deduping vertices when unkinking a polygon.

## [0.0.3] - 2025.05.13
### Fixed
- Peer dependencies using incorrect semantics.

## [0.0.2] - 2025.05.12
### Fixed
- Handle inconsistent Polygon winding order.

## [0.0.1] - 2025.05.11

Initial version.
