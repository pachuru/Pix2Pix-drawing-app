

export default class ExecutionHistory {

    constructor(){
        this.history =  []
        this.historyMaxLength = 4
        this.currentSnapshotIndex = -1
    }

    push = (element) => {
        if(this.currentSnapshotIndex >= (this.historyMaxLength - 1)){
            this.popBack()
            this.history[this.currentSnapshotIndex] = element
        }else{
          this.currentSnapshotIndex += 1
          this.history[this.currentSnapshotIndex] = element
        }
    }

    undo = () => {
        if(this.currentSnapshotIndex >= 1){
           this.currentSnapshotIndex -= 1
           return this.history[this.currentSnapshotIndex]
        }else return null;
    }

    redo = () => {
        if(this.currentSnapshotIndex <= (this.historyMaxLength - 2)){
            if(this.history[this.currentSnapshotIndex + 1] != null){
                this.currentSnapshotIndex += 1
                return this.history[this.currentSnapshotIndex]
            }else return null;
        }else return null;
    }

    
    popBack = () => {
        let newHistory = []
        for(var i = 1; i < this.historyMaxLength; i++){
            newHistory.push(this.history[i])
        }
        newHistory.push(null)
        this.history = newHistory;
    }

}