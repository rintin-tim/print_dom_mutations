# print_dom_mutations
This JS script prints DOM mutations for a given web element (and its children) to the browser console. 
This can be useful for debugging flaky Selenium scripts caused by slow loading pages.  
The muation types logged are 'childList' (i.e. node removal & node addition) and 'attribute' changes. 

To use:

1. Update `cssSelector` with selector of the web to be monitored e.g. `"#a-page"`
2. Run updated script in browser console
3. Changes to the observed web element or its children are logged in the console


Example:
```
-----
An attribute was modified. 
Modified element: 
<div class="a-carousel-viewport" style="height: 299px;" id="anonCarousel4"><ol class="a-carousel" role="list"><li class="a-carousel-card aok-float-left" role="listitem" aria-setsize="50" aria-posinset="1" aria-hidden="false" style="margin-left: 19px;">
        <div data-p13n-asin-metadata="{&quot;re
Previous attribute value: 
null

-----
Mutation: 'attributes' |  Total Mutations: 1
-----
A child node has been added or removed. 

Parent's outerHTML: 
<ol class="a-carousel" role="list"><li class="a-carousel-card aok-float-left" role="listitem" aria-setsize="50" aria-posinset="1" aria-hidden="false" style="margin-left: 19px;">
        <div data-p13n-asin-metadata="{&quot;ref&quot;:&quot;pd_sbs_21_1&quot;,&quot;asin&quot;:&quot;B083PHXSF5&quot;}" c ...
-----
Removed nodeName: 
#text
-----
Mutation: 'childList' |  Total Mutations: 2
```
