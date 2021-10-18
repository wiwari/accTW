#!/usr/bin/bash
# docker_run_opt="-e LANG=C.UTF-8 --rm -it -p 8080:80 -v $(pwd):/usr/local/apache2/htdocs/ -w /usr/local/apache2/htdocs/"
docker_run_opt="-e LANG=C.UTF-8 --rm -d -it -p 8080:80 -v $(pwd):/usr/local/apache2/htdocs/ -w /usr/local/apache2/htdocs/"
docker run ${docker_run_opt} httpd
