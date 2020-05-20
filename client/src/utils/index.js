
export const utils = {
        
        arraysAreEqual(arr1, arr2){

            if(arr1.length !== arr2.length)
                return false

            for(let i = 0; i < arr1.length; i++){
                if(arr1[i] !== arr2[i])
                    return false
            }

            return true
        },

        isPointInsideRectangle(rectangle, pointX, pointY){
            const {x, y, width, height} = rectangle;
            let x2 = x + width;
            let y2 = y + height;
            let isInsideXBoundarie = false
            let isInsideYBoundarie = false
            if(pointX >= Math.min(x,x2) && pointX <= Math.max(x,x2))
                isInsideXBoundarie = true
            if(pointY >= Math.min(y,y2) && pointY <= Math.max(y,y2))
                isInsideYBoundarie = true
            return isInsideXBoundarie && isInsideYBoundarie
        },

        calculateRectanglesUnderPoint(rectangles, pointX, pointY){
            const rectanglesUnderPoint = []
            for (let i = 0; i < rectangles.length; i++) {
             if (utils.isPointInsideRectangle(rectangles[i], pointX, pointY)) { rectanglesUnderPoint.push(rectangles[i]) }
            }
            return rectanglesUnderPoint;
        },

        sortArrayBy(arr, attribute, order){
            let sortedArr =  order == "decreasing" ? arr.sort((a, b) => (a[attribute] > b[attribute]) ? -1 : 1)
                                                   : arr.sort((a, b) => (a[attribute] > b[attribute]) ? 1 : -1)
            return sortedArr
        }


}

export default utils;