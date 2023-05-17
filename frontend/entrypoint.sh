#!/usr/bin/env bash
set -e
echo "WHERE IS CERTBOT"
exec systemctl start nginx
exec certbot --nginx -n --agree-tos --email thekaryainc@gmail.com -d datadaan-dibd.centralindia.cloudapp.azure.com --redirect
exec rm /etc/nginx/conf.d/default.conf
exec cp nginx.conf /etc/nginx/conf.d
# exec nginx -g "daemon off;"
exec systemctl restart nginx