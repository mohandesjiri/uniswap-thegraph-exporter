const { gql, GraphQLClient } =  require('graphql-request')

const client = new GraphQLClient('https://api.thegraph.com/subgraphs/name/isesattelite/tune-trading')
//todo
const startBlockNumber = 13717846
const firstBlockTimestamp= 1638316799
const finalBlockTimestamp = 1640995201 //block number: 13916166

const mintHistoryQuery = {
	builder: gql`
      query ($endBlockTimestamp: BigInt, $startBlockTimestamp: BigInt, $startBlockNumber: Int) {
          mintRecords(block: {  number_gte: $startBlockNumber}, where: { timestamp_gt: $startBlockTimestamp, timestamp_lte: $endBlockTimestamp }, orderBy: timestamp, orderDirection: asc) {
              id
              sender
              amount0
              amount1
              timestamp
          }
      }
	`,
	field: 'mintRecords'
}

const burnHistoryQuery = {
	builder: gql`
      query ($endBlockTimestamp: BigInt, $startBlockTimestamp: BigInt, $startBlockNumber: Int) {
          burnRecords(block: {  number_gte: $startBlockNumber}, where: { timestamp_gt: $startBlockTimestamp, timestamp_lte: $endBlockTimestamp }, orderBy: timestamp, orderDirection: asc) {
              id
              sender
              amount0
              amount1
              to
              timestamp
          }
      }
	`,
	field: 'burnRecords'
}


const swapHistoryQuery = {
	builder: gql`
      query ($endBlockTimestamp: BigInt, $startBlockTimestamp: BigInt, $startBlockNumber: Int) {
          swapRecords(block: {  number_gte: $startBlockNumber}, where: { timestamp_gt: $startBlockTimestamp, timestamp_lte: $endBlockTimestamp }, orderBy: timestamp, orderDirection: asc) {
              id
              sender
              amount0In
              amount1In
              amount0Out
              amount1Out
              to
              timestamp
          }
      }
	`,
	field: 'swapRecords'
}

const reserveHistoryQuery = {
	builder: gql`
      query ($endBlockTimestamp: BigInt, $startBlockTimestamp: BigInt, $startBlockNumber: Int) {
          reseveRecords(block: {  number_gte: $startBlockNumber}, where: { timestamp_gt: $startBlockTimestamp, timestamp_lte: $endBlockTimestamp }, orderBy: timestamp, orderDirection: asc) {
              id
              reserve0
              reserve1
              timestamp
          }
      }
	`,
	field: 'reseveRecords'
}

async function executeQuery(query, startBlockTimestamp, endBlockTimestamp) {
	if(Number(startBlockTimestamp) > finalBlockTimestamp) {
		return []
	}
	if(Number(endBlockTimestamp) < firstBlockTimestamp) {
		return []
	}
	const data = await client.request(query.builder, {
		startBlockTimestamp: String(Math.max(Number(startBlockTimestamp), firstBlockTimestamp)),
		endBlockTimestamp: String(Math.min(Number(endBlockTimestamp), finalBlockTimestamp)),
		startBlockNumber,
	})
	const result = data[query.field]
	console.log({ result })
	return result
}

const period = 3600 * 12
async function loop() {
	let output = [1];
	let startTime = firstBlockTimestamp
	let endTime = startTime + period
	while (output.length > 0) {
		output = await executeQuery(swapHistoryQuery, startTime, endTime);
		console.log('=====================================')
		console.log(output)
		startTime = endTime
		endTime += period
	}
}

loop();

