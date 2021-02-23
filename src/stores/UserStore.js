import { extendObservable } from 'mobx';

/**
 * UserStore. Stores data about the user.
 */
class UserStore {
    constructor() {
        extendObservable(this, {
            email: '',
            firstName: '',
            lastName: ''
        })
    }
}

export default new UserStore();