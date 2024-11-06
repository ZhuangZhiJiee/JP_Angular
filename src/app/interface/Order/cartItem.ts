export interface cartItem{
  ItineraryDateSystemId:number  //商品ItineraryDateSystemid
  ItinerarySystemId:number      //商品ItinerarySystemid
  name:string                   //商品名稱
  price:number                  //商品單價
  quantity:number               //數量
  imagePath:string              //圖片路徑
  // 只針對行程進行結帳 不做行程船票的區分
}
