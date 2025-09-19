class ApiFeatures{
    constructor(query,querystr){
        this.query=query;
        this.querystr=querystr;
    }
    search(){
        if(!this.querystr.keyword || this.querystr.keyword.trim()===""){
            return this;
        }
        const keyword = this.querystr.keyword?{
            name:{
                $regex:this.querystr.keyword,
                $options:"i", //i stands for case sensitive
            }
        }:{}
//    console.log(keyword);
        this.query=this.query.find({...keyword});
        return this;
    }  
    filter() {
        const queryCopy = { ...this.querystr };
        // Fields to remove from the filter query
        const removeField = ["keyword", "page", "limit"];
        // Removing the specified fields
        removeField.forEach((key) => delete queryCopy[key]);
        // Convert filter object to JSON string and add MongoDB operators ($gt, $gte, etc.)
        let queryStr = JSON.stringify(queryCopy);
        queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g, (key) => `$${key}`);
        // Apply the filter to the query
        this.query = this.query.find(JSON.parse(queryStr));
        console.log(queryStr)
        return this;
    }
    pagination(resultPerPage) {
        const currentPage = Number(this.querystr.page) > 0 ? Number(this.querystr.page) : 1;
        const skip = resultPerPage * (currentPage - 1);
        
        this.query = this.query.skip(skip).limit(resultPerPage);
        return this;
    }
    
};

module.exports = ApiFeatures;