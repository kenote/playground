all: install

install:
	@cd api-server
	@[ ! -d node_modules ] && npm install --production
	@cd ..
	@cd web-server
	@[ ! -d node_modules ] && npm install
	@cd ..

start:
	@[ -f ecosystem.config.js ] && pm2 start ecosystem.config.js && pm2 save

delete:
	@[ -f ecosystem.config.js ] && pm2 delete ecosystem.config.js && pm2 save --force

restart:
	@[ -f ecosystem.config.js ] && pm2 restart ecosystem.config.js

stop:
	@[ -f ecosystem.config.js ] && pm2 stop ecosystem.config.js