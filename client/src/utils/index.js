
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
        },


        calculateCorners(rectangle){
            let topRight, topLeft, bottomRight, bottomLeft
            const {x, y, width, height} = rectangle

            if(rectangle.width < 0 && rectangle.height < 0){
                topRight =    { x: x,           y: y + height } 
                topLeft =     { x: x + width,   y: y + height }
                bottomRight = { x: x ,          y: y }
                bottomLeft =  { x: x + width,   y: y }
            }else if(rectangle.width < 0 && rectangle.height > 0){
                topRight =    { x: x,           y: y } 
                topLeft =     { x: x + width,   y: y }
                bottomRight = { x: x ,          y: y + height }
                bottomLeft =  { x: x + width,   y: y + height } 
            }else if(rectangle.width > 0 && rectangle.height < 0){
                topRight =    { x: x + width,   y: y + height } 
                topLeft =     { x: x,           y: y + height }
                bottomRight = { x: x + width,   y: y }
                bottomLeft =  { x: x,           y: y } 
            }else if(rectangle.width > 0 && rectangle.height > 0){
                topRight =    { x: x + width,   y: y } 
                topLeft =     { x: x,           y: y }
                bottomRight = { x: x + width,   y: y + height }
                bottomLeft =  { x: x,           y: y + height } 
            }

            return {topRight, topLeft, bottomRight, bottomLeft}
        },

        closerTo(corners, point){
            const {topRight, topLeft, bottomRight, bottomLeft} = corners
            const {x, y} = point

            const width = topRight.x - topLeft.x
            const height = bottomRight.y - topRight.y

            if(x < (topLeft.x + width / 2) && y < (topLeft.y + height / 2)){
                return topLeft
            }else if(x < (topLeft.x + width / 2) && y > (topLeft.y + height / 2)){
                return bottomLeft
            }else if(x > (topLeft.x + width / 2) && y < (topLeft.y + height / 2)){
                return topRight
            }else if(x > (topLeft.x + width / 2) && y > (topLeft.y + height / 2)){
                return bottomRight
            }
        }
        

}

export default utils;