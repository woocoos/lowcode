
const dbName = "adminx", storeName = 'lowcode', version = 1;

export type DbDataSchema = {
    path: IDBValidKey
    schema: any
}

const openDB = function () {
    return new Promise<IDBDatabase>((resolve, reject) => {
        // 打开数据库，若没有则会创建
        const dbReq = window.indexedDB.open(dbName, version);
        // 数据库打开成功回调
        dbReq.onsuccess = () => {
            resolve(dbReq.result);
        };
        // 数据库打开失败的回调
        dbReq.onerror = () => {
            reject()
        };

        // 数据库有更新时候的回调
        dbReq.onupgradeneeded = () => {
            // 数据库创建或升级的时候会触发
            const db = dbReq.result; // 数据库对象

            // 创建存储库
            const objectStore = db.createObjectStore(storeName, {
                keyPath: "path", // 这是主键
            });

            objectStore.createIndex("schema", "schema", { unique: false });
        };
    });
}

// 保存数据
export const save = async function (data: DbDataSchema) {
    const db = await openDB();

    return new Promise((resolve, reject) => {
        const transaction = db.transaction([storeName], "readwrite");
        const objectStore = transaction.objectStore(storeName);
        if (data?.path) {
            const getReq = objectStore.get(data.path)

            getReq.onsuccess = (event) => {
                const getData: DbDataSchema = getReq.result;
                let actionReq
                if (getData?.path) {
                    actionReq = objectStore.put(data);
                } else {
                    actionReq = objectStore.add(data);
                }

                actionReq.onsuccess = () => {
                    resolve(data)
                }
                actionReq.onerror = () => {
                    reject()
                }
            }

            getReq.onerror = () => {
                reject()
            }
        }
    }
}

// 获取数据
export const get = async function (key: IDBValidKey) {
    const db = await openDB()
    return new Promise<DbDataSchema>((resolve, reject) => {
        const request = db.transaction([storeName], 'readonly').objectStore(storeName).get(key);

        request.onerror = function (event) {
            reject()
        };

        request.onsuccess = function (event) {
            resolve(request.result)
        };
    }
}