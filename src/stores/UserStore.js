import { extendObservable } from 'mobx';

/**
 * UserStore. Stores data about the user.
 */
class UserStore {
    constructor() {
        extendObservable(this, {
            loading: true,
            isLoggedIn: false,
            email: '',
            firstName: '',
            lastName: ''
        })
    }
}

export default new UserStore();