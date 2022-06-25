# service workerを触って見るときに参考にしたページメモ

以下で勉強  
https://dev.to/blarzhernandez/javascript-service-workers-visualized-1683

以下は勉強の準備  
## nodeで動かす
セキュアな環境でないとservice workerは動かないそうなのでnodeで立ち上げてみる(localhost, httpは動かない)  
https://stackoverflow.com/questions/39136625/service-worker-registration-failed

以下を参考に、いったんhttpでhtmlをserveするページを作ってみる ※1  
ここでservice workerを使ったページを開くと、service workerは動かなかった  
https://developer.mozilla.org/ja/docs/Learn/Server-side/Node_server_without_framework

## https化

以下を参考に実装  
(自己証明書を使っているからfirefoxから警告が出た)  
https://kaworu.jpn.org/javascript/node.  js%E3%81%AB%E3%82%88%E3%82%8BHTTPS%E3%82%B5%E3%83%BC%E3%83%90%E3%81%AE%E4%BD%9C%E3%82%8A%E6%96%B9

自己証明書でもservice workerのinsecure errorが出る...  
↓  
そんなことはなかった。  
service workerのjsファイルを撮ってくる際にmimeがapplication/octet-streamになっていたことが原因でerrorになっていた。  
service workerとして登録できるのはjs系のmimeを持つファイルのみで、js系のmimeになるよう修正したあとはエラーが出ず登録完了できた。

secureじゃないページでservice workerを動かす  
https://stackoverflow.com/questions/38728176/can-you-use-a-service-worker-with-a-self-signed-certificate  

※1  
以下のように書いてたら次のエラーが出た  
> Error [ERR_HTTP_HEADERS_SENT]: Cannot set headers after they are sent to the client  

text/plainの200のレスポンス後にfileReadのレスポンス用headerを設定しようとしていたのが原因  

``` js
const server = http.createServer((req, res) => {
    let filePath = '.' + req.url;
    if (filePath == './') {
        filePath = './main.html';
    }

    let extname = String(path.extname(filePath)).toLowerCase();
    let mimeTypes = {
        '.html': 'text/html',
    }
    let contentType = mimeTypes[extname] || 'application/octet-stream';

    fs.readFile(filePath, (error, content) => {
        if (error) {
            if (error.code == 'ENOENT') {
                res.writeHead(404, { 'Content-Type': 'text/plain' });
                res.write("no such file or directory");
                res.end();
            } else {
                res.writeHead(500);
                res.end('Sorry, check with the site admin for error: '+error.code+' ..\n');
            }
        } else {
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(content, 'utf-8');
        }
    });

    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    res.end('Hello World\n');
});
```
