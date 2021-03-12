import { extendObservable } from 'mobx';

/**
 * ProjectStore. Stores data about a single project.
 */
class ProjectStore {
    constructor() {
        extendObservable(this, {
            projectId: '',
            projectName: '',
            projectDescription: '',
            isPrivate: '',
            creationDate: ''
        })
    }
}

export default new ProjectStore();