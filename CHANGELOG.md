# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

- none

## [2.0.0] - 2025-09-07

### Changed

- **BREAKING**: Converted from TypeScript to vanilla JavaScript - no build system required
- **BREAKING**: Changed syntax from `((tag/label/color))` to `((badge/content/style))` to avoid conflicts with Obsidian tags
- **BREAKING**: Removed hardcoded tag restrictions - any content can now be used as badges
- **BREAKING**: Removed hardcoded color restrictions - any CSS class can be used for styling
- **BREAKING**: Removed dual separator support (`|` and `/`) - now only supports `/`
- **BREAKING**: Removed arrow-tags feature - simplified to focus on core badge functionality
- **BREAKING**: Removed hex color support - styling now relies entirely on CSS classes
- Replaced npm scripts with portable Makefile for release management
- Simplified GitHub Actions workflow to verify pre-built files only
- Updated CSS to use Obsidian theme variables for better integration
- Eliminated all npm dependencies (127 packages removed)
- Improved performance for large documents with code blocks
- Optimized regex handling to prevent state conflicts between edit and view modes

### Removed

- TypeScript build system (esbuild, tsconfig, etc.)
- All hardcoded tag and color mappings
- Arrow-tags functionality  
- Example documentation files
- Development container configuration

### Added

- Makefile for cross-platform release management using basic Unix tools
- Support for any text content as badge labels
- Dynamic CSS class generation from badge content and style parameters

## [1.3.1] - 2025-08-19

### Fixed

- Support for markdown tables

## [1.3.0] - 2025-08-19

### Added

- Support for using either `|` or `/` as seperators

## [1.2.3] - 2024-12-13

### Fixed

- Extension name inconsistencies

## [1.2.2] - 2024-12-13

### Fixed

- Extension breaks other elemets in Preview Mode
- Some elements in Preview Mode and Edit mode did not support tags


## [1.2.1] - 2024-11-28

### Fixed

- Issues with callout box conflicts

## [1.2.0] - 2024-11-26

### Added

- Support for reader view
- Example markdown documents

### Changed

- Improved arrow tag styling

## [1.1.1] - 2024-11-15

### Fixed

- README.md had some arrow tags that were not opened correctly
- Code comments had the old tag format

## [1.1.0] - 2024-11-15

### Changed

- Tags are now formatted using `((tag|label|bgcolor|fgcolor))` format so as not to conflict with other common markdown
- CSS class is now bn-tags amd bn-arrow-tags so as not to conflict with other common classes
- README.md reflects new tag format

## [1.0.2] - 2024-11-11

### Changed

- Updated name to remove obsidian from prefix

## [1.0.1] - 2024-11-11

### Added

- Release prep and workflows

## [1.0.0] - 2024-11-08

### Added

- Initial release checkin
