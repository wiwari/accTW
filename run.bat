@echo off
set docker_run_opt=-e LANG=C.UTF-8 --rm -d -it -p 8080:80 -v %cd%:/usr/local/apache2/htdocs/ -w /usr/local/apache2/htdocs/
REM set docker_run_opt=-e LANG=C.UTF-8 --rm -it -p 8080:80 -v %cd%:/usr/local/apache2/htdocs/ -w /usr/local/apache2/htdocs/
docker run %docker_run_opt%  httpd