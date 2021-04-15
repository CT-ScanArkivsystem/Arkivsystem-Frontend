import { extendObservable } from 'mobx';

/**
 * UserEditStore. Stores data about the user.
 */
class UserEditStore {
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

export default new UserEditStore();