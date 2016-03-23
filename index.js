$(function() {
  /* リスト内容をJSON形式で全格納
    url   : URL
    title : タイトル
  */
  var list_data = [];

  // データをロード
  var addToList = function() {
    $("ul").text("");
    for(var i = 0 ; i < list_data.length; i++) {
      console.log(list_data[i].title);
      var new_li = "<li><a target='_blank' href='" + list_data[i].url + "'>" + list_data[i].title +  "</a><span class='reload' name='" + i + "'></span><span class='delete' name=' " + length + "'></span></li>";
      $("ul").append(new_li);
    }
    add_events();
  };

  // サーバに同期
  var save = function(){
    chrome.storage.sync.set({'key' : list_data}, function(){
      console.log("saved");
    });
  };

  // リストに１つ追加
  var addOne = function(one_data) {
    console.dir(list_data);
    //配列についか
    list_data.push(one_data);
    save();

    //画面上追加
    var length =  list_data.length != 0 ? list_data.length - 1 : 0 ;
    var new_li = "<li><a target='_blank' href='" + one_data.url + "'>" + one_data.title +  "</a><span class='reload' name=' " + length + "'></span><span class='delete' name=' " + length + "'></span></li>";
    $("ul").append(new_li);

    //イベント付加
    add_events();
  };

  // 初期化処理
  (function(){
    console.log("initialize");

    chrome.storage.sync.get(['key'], function(value) {
      if(value.key.length == undefined) {
        list_data = [];
      } else {
        list_data = value.key;
      }

      addToList();
    });
  })();

  // プラスボタンをおした時の処理
  $("#plus").click(function() {
    var input_txt = $("#title").val();

    if(input_txt == "") {
      return false;
    }

    addOne({
      url : "hoehoe",
      title : input_txt
    });
  });

  var add_events = function() {
    delete_event();
    reload_event();
  }

  // デリートボタンをおした時の処理
  var delete_event = function() {
    $(".delete").off("click");
    $(".delete").on("click",function(event) {
      var index = event.currentTarget.attributes[1].value;
      list_data.splice(index,1);
      save();
      //event.currentTarget.parentNode.remove();
      addToList();
    });
  };

  // リロードボタンをおした時の処理
  var reload_event = function() {
    $(".reload").off("click");
    $(".reload").on("click",function(event) {
      var tab = chrome.tabs.getSelected(null ,function(tab) {
        var index = event.currentTarget.attributes[1].value;
        list_data[index].url = tab.url;
        console.log(tab.url);
        addToList();
        save();
      });
    });
  };


});
