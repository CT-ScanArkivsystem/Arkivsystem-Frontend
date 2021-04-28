import {onError} from "../libs/errorLib";
import {currentIP} from "../App";

export default async function RestartServer(date, time, zone) {
    try {
        let res = await fetch(currentIP + '/admin/restartServer', {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(
                {
                    date: date,
                    time: time,
                    zone: zone
                }
            )
        });
        if (res.ok) {
            console.log("api: Set restart")
        } else {
            console.log("api: Restart not set");
        }
    } catch (e) {
        onError(e);
        console.log("js api has caught an error");

    }
}
