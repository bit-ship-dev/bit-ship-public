## nightly
- feature: new volume primitive
- feature: new vaults primitive
- feature: config nested definitions support 
- feature: support tasks without command
- refactor: rename task option script to command
- refactor: include vendors to chunk
- refactor: replace citty with commander
- refactor: replace docker with podman
- qa: implement test suite
- feature: add aliases for command params

## 0.5.0 (2025-7-18)
- feature: exec by default run sh 
- feature: attouching container CLI to local process
- feature: image build script from local dockerfile
- refactor: container service 

## 0.4.0 (2025-4-18)
- feature: new App primitive 
- feature: run command can run apps
- feature: new command to stopping apps
- feature: new commands to control bit-ship demon 
- feature: bit-ship demon that runs in background and serves as reverse proxy

## 0.3.0 (2025-3-23)
- feature: run command can execute jobs
- feature: log storage
- feature: git hook for jobs
- feature: config validation

## 0.2.1 (2025-2-23)
- fix: unlink tmp_report.json 
- fix: extend existing config instead of rewriting it
- fix: analysis dependency summary

## 0.2.0 (2025-2-22)
- feature: create image command
- feature: pick version while building image
- feature: editing image after analysis
- refactor: bake in analyser cli
- refactor: get image api endpoint

## 0.1.3 (2025-2-10)
- fix: get rid of redundant log
- fix: daily activity ping

## 0.1.2 (2025-2-10)
- fix: daily activity ping

## 0.1.1 (2025-1-28)
- fix: add volume for run and exec command 

## 0.1.1 (2025-1-25)
- fix: exec and run
- refactor: moce bit-ship config to dedicated folder
- refactor: change config structure

## 0.1.0 (2025-1-2)
- fix: API point to prod URL
- fix: reset setting
- fix: pnpm catalog issue
- fix: platform docker image issue
- fix: image preparation polling
- feature: add package json metadata 
- feature: call API to get image from report
- refactor: bundle dependencies in instead of using external ones
- refactor: rename analyse command with init

## 0.0.2 (2024-12-16)
- test new release

## 0.0.1 (2024-10-20)
### Other
- Initial release
