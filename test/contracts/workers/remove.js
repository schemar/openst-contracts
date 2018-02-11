// Copyright 2017 OST.com Ltd.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//    http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
//
// ----------------------------------------------------------------------------
// Test: remove.js
//
// http://www.simpletoken.org/
//
// ----------------------------------------------------------------------------

const workers_utils = require('./workers_utils.js');
const Workers       = artifacts.require('./Workers.sol');

///
/// Test stories
///
/// fails to remove when sender is not opsAddress
/// pass to remove when sender is opsAddress

module.exports.perform = (accounts) => {
  const opsAddress          = accounts[1],
        worker1Address       =  accounts[2],
        worker2Address       =  accounts[3],
        height1  = new workers_utils.bigNumber(100),
        height2  = new workers_utils.bigNumber(140);
        
    before(async () => {

        workers = await Workers.new();
        assert.ok(await workers.setOpsAddress(opsAddress));    

        // set worker 1
        deactivationHeight = web3.eth.blockNumber + height1.toNumber();
        assert.ok(await workers.setWorker.call(worker1Address, deactivationHeight, { from: opsAddress }));
        response = await workers.setWorker(worker1Address, deactivationHeight, { from: opsAddress });
        assert.equal(await workers.isWorker.call(worker1Address), true);
        workers_utils.checkWorkerSetEvent(response.logs[0], deactivationHeight, height1.toNumber()-1);
        
        // set worker 2
        deactivationHeight = web3.eth.blockNumber + height2.toNumber();
        assert.ok(await workers.setWorker.call(worker2Address, deactivationHeight, { from: opsAddress }));
        response = await workers.setWorker(worker2Address, deactivationHeight, { from: opsAddress });
        assert.equal(await workers.isWorker.call(worker2Address), true);
        workers_utils.checkWorkerSetEvent(response.logs[0], deactivationHeight, height2.toNumber()-1);    

    });

    it('fails to remove when sender is not opsAddress', async () => {

        await workers_utils.utils.expectThrow(workers.remove.call({ from: accounts[4] }));    

    });

    it('pass to remove when sender is opsAddress', async () => {
            
        assert.ok(await workers.remove.call({ from: opsAddress }));            
        response = await workers.remove({ from: opsAddress })     
        workers_utils.utils.logResponse(response, 'Worker.remove');        
        assert.equal(await workers.isWorker.call(worker2Address), false);

    });

}


