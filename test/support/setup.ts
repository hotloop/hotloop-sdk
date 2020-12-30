import { use, should } from 'chai'

import * as nock from 'nock'
import * as sinonChai from 'sinon-chai'
import * as chaiAsPromised from 'chai-as-promised'

use(sinonChai)
use(chaiAsPromised)

nock.disableNetConnect()

should()