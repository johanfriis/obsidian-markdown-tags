# Obsidian Badge Plugin - Release Management

# Get current version from manifest.json using basic tools
CURRENT_VERSION := $(shell grep '"version"' manifest.json | sed 's/.*"version": *"\([^"]*\)".*/\1/')
MIN_APP_VERSION := $(shell grep '"minAppVersion"' manifest.json | sed 's/.*"minAppVersion": *"\([^"]*\)".*/\1/')

.PHONY: help release-patch release-minor release-major

help:
	@echo "Available commands:"
	@echo "  make release-patch  - Bump patch version and create release"
	@echo "  make release-minor  - Bump minor version and create release"  
	@echo "  make release-major  - Bump major version and create release"

release-patch:
	@echo "Creating patch release..."
	$(call create_release,patch)

release-minor:
	@echo "Creating minor release..."
	$(call create_release,minor)

release-major:
	@echo "Creating major release..."
	$(call create_release,major)

# Function to bump version, commit, and create release
define create_release
	$(eval OLD_VERSION := $(shell grep '"version"' manifest.json | sed 's/.*"version": *"\([^"]*\)".*/\1/'))
	$(eval NEW_VERSION := $(shell echo $(OLD_VERSION) | { \
		IFS=. read -r major minor patch; \
		if [ "$(1)" = "patch" ]; then \
			echo "$$major.$$minor.$$((patch + 1))"; \
		elif [ "$(1)" = "minor" ]; then \
			echo "$$major.$$((minor + 1)).0"; \
		elif [ "$(1)" = "major" ]; then \
			echo "$$((major + 1)).0.0"; \
		fi; \
	}))
	@echo "Creating release: $(OLD_VERSION) → $(NEW_VERSION)"
	
	# Update manifest.json
	sed 's/"version": *"[^"]*"/"version": "$(NEW_VERSION)"/' manifest.json > manifest.tmp && mv manifest.tmp manifest.json
	
	# Commit version changes
	git add manifest.json
	git commit -m "chore: bump version to $(NEW_VERSION)"
	
	# Create and push release
	git pull
	git tag -a "$(NEW_VERSION)" -m "$(NEW_VERSION)"
	git push origin main --tags
	
	@echo "Release $(NEW_VERSION) created and pushed!"
endef
