import { extendObservable } from 'mobx';

/**
 * UserStore. Stores data about the user.
 */
class UserStore {
    constructor() {
        extendObservable(this, {
            userId: '',
            email: '',
            firstName: '',
            lastName: '',
            role: ''
        })
    }
}

export default new UserStore();
