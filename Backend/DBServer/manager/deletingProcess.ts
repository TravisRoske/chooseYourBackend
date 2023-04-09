import { getExpired, deleteUserPartitions, deleteUser } from './dbManager.js'

//scans the dbUsersMaster database for users that have been inactive for an hour and deletes them
export async function deletingProcess() {
    setInterval(async () => {
        const expired = await getExpired() as []
        for(let e of expired){
            console.log("Deleting : ", e)

            deleteUserPartitions(e['userid'], e['dbsUsed'], e['serverid'])
            
            deleteUser(e["userid"])
        }
    }, 30000)
}