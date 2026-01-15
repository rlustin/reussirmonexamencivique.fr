.DEFAULT_GOAL := help
.PHONY: help install install-e2e test test-e2e lint lintfix build serve

help: ## Show this help message
	@grep -E '^[a-zA-Z0-9_-]+:.*## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-15s\033[0m %s\n", $$1, $$2}'

install: ## Install project dependencies
	@echo "Installing dependencies..."
	@npm install

install-e2e: ## Install Playwright browsers for E2E tests
	@echo "Installing Playwright browsers..."
	@npx playwright install chromium firefox webkit --with-deps

test: ## Run unit tests
	@echo "Running unit tests..."
	@npm run test:run

test-e2e: ## Run end-to-end tests
	@echo "Running E2E tests..."
	@npm run test:e2e

lint: ## Check code style with ESLint
	@echo "Checking code style..."
	@npm run lint

lintfix: ## Fix code style issues automatically
	@echo "Fixing code style issues..."
	@npm run lint:fix

build: ## Build the application for production (SSG)
	@echo "Building for production..."
	@STRIP_TEST_IDS=true npm run generate

serve: ## Start the development server
	@echo "Starting development server..."
	@npm run dev
