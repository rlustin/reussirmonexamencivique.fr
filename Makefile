.DEFAULT_GOAL := help
.PHONY: help install test lint lintfix build serve

help: ## Show this help message
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-15s\033[0m %s\n", $$1, $$2}'

install: ## Install project dependencies
	@echo "Installing dependencies..."
	@npm install

test: ## Run tests
	@echo "Running tests..."
	@npm run test:run

lint: ## Check code style with ESLint
	@echo "Checking code style..."
	@npm run lint

lintfix: ## Fix code style issues automatically
	@echo "Fixing code style issues..."
	@npm run lint:fix

build: ## Build the application for production (SSG)
	@echo "Building for production..."
	@npm run generate

serve: ## Start the development server
	@echo "Starting development server..."
	@npm run dev
