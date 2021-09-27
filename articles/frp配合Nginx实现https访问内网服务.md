#### 起因
已有的vps挂有不可描述应用，已经用```acme```脚本申请过证书,所以用nginx配合frp做反向代理实现https访问内网应用

#### 在域名服务商处添加二级域名解析
添加 ```frp.sample.com``` 解析或者 ```*.sample.com```解析到vps服务ip地址

#### 申请证书
- 申请
```sh
acme.sh --issue -d "${domain}" --standalone -k ec-256 --force
```
- 配置
```sh
acme.sh --installcert -d "${domain}" --fullchainpath /data/v2ray.crt --keypath /data/v2ray.key --ecc --force
```


#### 安装frp
- ##### 服务端
1. 下载frp
```sh
wget https://github.com/fatedier/frp/releases/download/v0.37.1/frp_0.37.1_darwin_amd64.tar.gz
```

2. 解压 ```tar xzvf frp_0.37.1_darwin_amd64.tar.gz```

3. 编辑 ```frps.ini```文件
```sh
[common]
bind_port = 7000
dashboard_port = 7500
dashboard_user = *****    // frp 面板用户名
dashboard_pwd = *****     // frp 面板密码 
vhost_http_port = 9000    // http 服务端口
max_pool_count=5
privilege_token = **********    // 验证token，需要和客户端保持一致
```

4. 添加systemctl管理
```sh
vi /usr/lib/systemd/system/frp.service
```
贴入以下内容
```sh
[Unit]
Description=The nginx HTTP and reverse proxy server
After=network.target remote-fs.target nss-lookup.target

[Service]
Type=simple
ExecStart=/root/frp/frp_0.37.1_linux_amd64/frps -c /root/frp/frp_0.37.1_linux_amd64/frps.ini
KillSignal=SIGQUIT
TimeoutStopSec=5
KillMode=process
PrivateTmp=true
StandardOutput=syslog
StandardError=inherit

[Install]
WantedBy=multi-user.target
```
执行 ``` systemctl daemon-reload```重新载入配置文件，让设置生效

手动开启frp ```systemctl start frp.service```

设置开机启动 ```systemctl enable frp.service```

- 客户端
步骤和上面差不多不赘述了，列下不同点
    1. frp客户端地址为```https://github.com/fatedier/frp/releases/download/v0.37.1/frp_0.37.1_linux_arm.tar.gz```

    2. 客户端的配置文件为``` frpc.ini```内容如下
    ```sh
    [common]
    server_addr = ******   // 服务器ip地址
    server_port = 7000
    privilege_token = ******  

    [web]
    type = http
    local_ip = 127.0.0.1    // 本地服务ip
    local_port = 80         // 本地服务端口
    custom_domains = frp.sample.com
    remote_port = 80        // 远程服务端口，nginx服务端口

    [ssh]
    type = tcp
    local_ip = 127.0.0.1
    local_port = 22
    remote_port = 6000
    ```

    3. systemctl管理
    树莓派路径为：```/etc/systemd/system/frpc.service```

#### 服务端Nginx配置
```sh
server {
	listen 443 ssl http2;
	listen [::]:443 http2;
        ssl_certificate       /data/frp.crt;
        ssl_certificate_key   /data/frp.key;
        ssl_protocols         TLSv1.3;
        ssl_ciphers           TLS13-AES-256-GCM-SHA384:TLS13-CHACHA20-POLY1305-SHA256:TLS13-AES-128-GCM-SHA256:TLS13-AES-128-CCM-8-SHA256:TLS13-AES-128-CCM-SHA256:EECDH+CHACHA20:EECDH+CHACHA20-draft:EECDH+ECDSA+AES128:EECDH+aRSA+AES128:RSA+AES128:EECDH+ECDSA+AES256:EECDH+aRSA+AES256:RSA+AES256:EECDH+ECDSA+3DES:EECDH+aRSA+3DES:RSA+3DES:!MD5;
	server_name frp.sample.com;
        index index.html index.htm;
        root  /home/wwwroot/3DCEList;
        error_page 400 = /400.html;

        ssl_early_data on;
        ssl_stapling on;
        ssl_stapling_verify on;
        add_header Strict-Transport-Security "max-age=31536000";

#  将https服务代理到http
	location /
        {
        proxy_pass http://frp.sample.com:9000;   
	proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header Host $http_host;
        proxy_set_header X-NginX-Proxy true;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_max_temp_file_size 0;
        proxy_redirect off;
        proxy_read_timeout 240s;
        }

}
    server {
        listen 80;
        listen [::]:80;
    	server_name frp.sample.com;
    	return 301 https://frp.sample.com$request_uri;
    }

```

#### 服务端frp dashboard Nginx配置

用```/dashboard/``` 前缀做的反向代理
```sh
location /dashboard/
{
proxy_pass http://localhost:7500/;
proxy_http_version 1.1;
proxy_set_header Upgrade $http_upgrade;
proxy_set_header Connection 'upgrade';
proxy_set_header Host $host;
proxy_set_header X-Forwarded-For $remote_addr;
proxy_cache_bypass $http_upgrade;
}
```

dashboard 登录完成后会出现前缀路径丢失变成了```frp.sample.com/static/```代理的路径应该为```frp.sample.com/dashboard/static/```基于这个原因做了路径改写
```sh
location /
    {
        rewrite (.*)/static/$ $1/dashboard/static/ permanent;
    }
```






