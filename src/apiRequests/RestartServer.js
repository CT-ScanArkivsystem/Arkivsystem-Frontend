import {onError} from "../libs/errorLib";
import {currentIP} from "../App";

export default async function RestartServer(restartDate, restartTime, restartZone) {
    try {
        let res = await fetch(currentIP + '/admin/restartServer', {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(
                {
                    date: restartDate,
                    time: restartTime,
                    zone: restartZone
                }
            )
        });
        if (res.ok) {
            // console.log("api: Set restart")
        } else {
            console.log("api: Restart not set");
        }
    } catch (e) {
        onError(e);
        console.log("js api has caught an error");

    }
}
