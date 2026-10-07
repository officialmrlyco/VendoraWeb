import test from 'node:test';
import assert from 'node:assert/strict';
import {documentData,validPlans,validSubscription,officialRelease} from './public-model.mjs';
test('Firestore catalog values decode and malformed plans remain unavailable',()=>{
  assert.deepEqual(documentData({fields:{price:{integerValue:'1000'},active:{booleanValue:false}}}),{price:1000,active:false});
  assert.deepEqual(validPlans({plans:[{label:'Bad',amount:-1,type:'RUNS'},{label:'Good',amount:20,type:'RUNS',runs:200}]}),[{label:'Good',amount:20,type:'RUNS',runs:200,duration:0}]);
  assert.equal(validSubscription({price:0,limit:5,active:true}),null);
  assert.deepEqual(validSubscription({price:1000,limit:5,active:false}),{price:1000,limit:5,active:false});
});
const release=(url,name='vendora.apk',extra={})=>({name:'Vendora',published_at:'2026-10-07T10:00:00Z',assets:[{name,browser_download_url:url,size:123}],...extra});
test('APK links must belong to the exact official repo and be stable signed releases',()=>{
  const url='https://github.com/officialmrlyco/VendoraWeb/releases/download/v1/vendora.apk';
  assert.equal(officialRelease([release(url)]).url,url);
  for(const r of [release('javascript:alert(1)'),release('https://github.com/another/repo/releases/download/v1/a.apk'),release(url,'app-debug.apk'),release(url,'vendora.apk',{prerelease:true}),release(url,'vendora.apk',{draft:true})])assert.equal(officialRelease([r]),null);
  assert.equal(officialRelease([]),null);
  assert.throws(()=>officialRelease({}));
});
