
info:
	@echo ''
	@echo 'Project to Create React Typescript TDD';
	@echo '     https://github.com/nvm-sh/nvm';
	@echo ''
install-nvm:
	curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.37.0/install.sh | bash
	@echo 'Now please, start a new terminal, so you can run nvm command'
	@echo ''
use-node:
	@echo ''
	#${HOME}/.config/nvm/nvm-exec install 14
	#${HOME}/.config/nvm/nvm-exec nvm use 14
	@echo 'please run: nvm install 14'
	@echo 'please run: nvm use 14'
	@echo ''
install-react: 
	npm install create-react-app
create-ui:
	npx create-react-app ui --template typescript 
start-ui:
	cd ui && npm run start
add-e2e:
	cd ui && npm i -D cypress
open-e2e:
	cd ui && ./node_modules/.bin/cypress open &
doc-e2e:
	@echo ''
	@echo 'TDD - E2E - Cypress '
	@echo '     https://softwarecrafters.io/react/tdd-react-typescript'
	@echo '     https://docs.cypress.io/guides/getting-started/installing-cypress.html#Opening-Cypress'
	@echo '     https://github.com/cypress-io/cypress-docker-images'
	@echo ''
test:
	cd ui && npm run test	





