## Install gsutil & set cors:
- curl https://bootstrap.pypa.io/get-pip.py | python3
- sudo pip3 install gsutil
- cd DevOps
- gsutil config
- gsutil cors set cors.json gs://szkt-parkolas-dev.appspot.com
- gsutil cors set cors.json gs://szkt-parkolas-stg.appspot.com
- gsutil cors set cors.json gs://szkt-parkolas-prod.appspot.com

## Indexes
- cd DevOps && firebase use default && firebase firestore:indexes > ./store/firestore.indexes.json