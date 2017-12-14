
<script type='text/javascript'>//<![CDATA[
  $(window).load(function(){
    $('.content:not(.focus)').keyup(function(){

    var value = $(this).val();
    var contentAttr = $(this).attr('name');

    $('.'+contentAttr+'').html(value.replace(/\r?\n/g,'<br/>'));

    })

  });//]]>

</script>

<body>

  <textarea name="mas" rows="15" class="content" ></textarea>

  <div class="mas" >
    <pre contenteditable="true" id="p1" >Text</pre>
  </div>

  <button onclick="this.value=this.value.replace(/[\n\r](?! \w)/gi,'');">Remove Spaces</button>
  <button onclick="copyToClipboard('#p1')" >Copy</button></pre>

</body>


field = item.OutterObj[0].NextObj[0] ? item.OutterObj[0].NextObj[0].field : item.OutterObj[0].NextObj.field;
html += "<li class='information'>" + field + "</li>";
