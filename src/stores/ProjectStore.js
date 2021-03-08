import { extendObservable } from 'mobx';

/**
 * ProjectStore. Stores data about a single project.
 */
class ProjectStore {
    constructor() {
        extendObservable(this, {
            email: '',
            firstName: '',
            lastName: '',
            role: ''
        })
    }
}

export default new ProjectStore();