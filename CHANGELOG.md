# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]
### Added
- App store data.

## [2.1.0] - 2019-12-20
## Added
- Agent field, so Facebook can track VTEX/GoCommerce pixels.

## [2.0.4] - 2019-10-14

## [2.0.3] - 2019-09-25

## [2.0.2] - 2019-08-30
### Changed
- Track all skus of in ViewContent event.

## [2.0.1] - 2019-06-07

### Fixed

- SSR.

## [2.0.0] - 2019-06-05

### Changed

- **BREAKING** Update to new pixel builder.

### Removed

- ViewContent events from department and category.
- Search event.

### Fixed

- Product ViewContent event parameters.
- Missing param `value` of AddToCart event.
- Trigger of PageView event.

## [1.2.0] - 2019-03-18
### Added
- Add `pixel` policy.

## [1.1.0] - 2019-01-26
### Changed
- Update to new pixel architecture.

## [1.0.2] - 2018-10-19
### Fixed
- Fix `content_ids` field in search, department and category pages.

## [1.0.1] - 2018-10-19

## [1.0.0] - 2018-10-18
### Added
- Add icon and description of the app.
- Make this app pluggable with any IO store.

## [0.1.1] - 2018-10-18
### Fixed
- Fix error when no pixel ID is defined.

## [0.1.0] - 2018-10-05
### Added
- MVP of `Facebook Pixel`.
