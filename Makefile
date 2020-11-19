
info:
	@echo 'Project to Create React Typescript TDD';
	@echo '     https://github.com/nvm-sh/nvm';
install-nvm:
	curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.37.0/install.sh | bash
	@echo 'Now please, start a new terminal, so you can run nvm command'
use-node:
	#${HOME}/.config/nvm/nvm-exec install 14
	#${HOME}/.config/nvm/nvm-exec nvm use 14
	@echo 'please run: nvm install 14'
	@echo 'please run: nvm use 14'
install-react: 
	npm install create-react-app
create-ui:
	npx create-react-app ui --template typescript 
start-ui:
	cd ui && npm run start

