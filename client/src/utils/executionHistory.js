
/**
 * ExecutionHistory class stores a set of objects in a list
 * and allows to go trough them. When the max capacity of the list
 * is reached it push the next object and deletes the oldest inserted
 * (fifo)
 */
export default class ExecutionHistory {

    /**
     * @param {Array} history a list of objects
     * @param {Number} historyMaxLength maximum length that the history list can have
     * @param {Number} currentSnapshotIndex the index of the object that
     * was lastly returned
     */
    constructor(){
        this.history =  []
        this.historyMaxLength = 4
        this.currentSnapshotIndex = -1
    }

    /**
     * Pushes an element into the history list. If there's no space
     * left it releases first.
     */
    push = (element) => {
        if(this.currentSnapshotIndex >= (this.historyMaxLength - 1)){
            this.popBack()
            this.history[this.currentSnapshotIndex] = element
        }else{
          this.currentSnapshotIndex += 1
          this.history[this.currentSnapshotIndex] = element
        }
    }

    /**
     * Returns the element inserted before to the one that's 
     * being addressed by currentSnapshotIndex.
     * If the currentSnapshotIndex points to the first element
     * it returns null
     */
    undo = () => {
        if(this.currentSnapshotIndex >= 1){
           this.currentSnapshotIndex -= 1
           return this.history[this.currentSnapshotIndex]
        }else return null;
    }

    /**
     * Returns the element inserted after the one that's 
     * being addressed by currentSnapshotIndex
     * If the currentSnapshotIndex points to the last element
     * it returns null
     */
    redo = () => {
        if(this.currentSnapshotIndex <= (this.historyMaxLength - 2)){
            if(this.history[this.currentSnapshotIndex + 1] != null){
                this.currentSnapshotIndex += 1
                return this.history[this.currentSnapshotIndex]
            }else return null;
        }else return null;
    }

    /**
     * Delete the oldest element creating a new empty position
     */
    popBack = () => {
        let newHistory = []
        for(var i = 1; i < this.historyMaxLength; i++){
            newHistory.push(this.history[i])
        }
        newHistory.push(null)
        this.history = newHistory;
    }

}