const { gql, GraphQLClient } =  require('graphql-request')

const client = new GraphQLClient('https://api.thegraph.com/subgraphs/name/isesattelite/tune-trading')
//todo
const startBlockNumber = 13717846
const endBlockTimestamp = "1643673540" //block number: 13916166

const mintHistoryQuery = {
	builder: gql`
      query ($first: Int, $skip: Int, $endBlockTimestamp: BigInt, $startBlockNumber: Int) {
          mintRecords(first: $first, skip: $skip, block: {  number_gte: $startBlockNumber}, where: { timestamp_lte: $endBlockTimestamp }, orderBy: timestamp, orderDirection: asc) {
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
      query ($first: Int, $skip: Int, $endBlockTimestamp: BigInt, $startBlockNumber: Int) {
          burnRecords(first: $first, skip: $skip, block: {  number_gte: $startBlockNumber}, where: { timestamp_lte: $endBlockTimestamp }, orderBy: timestamp, orderDirection: asc) {
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
      query ($first: Int, $skip: Int, $endBlockTimestamp: BigInt, $startBlockNumber: Int) {
          swapRecords(first: $first, skip: $skip, block: {  number_gte: $startBlockNumber}, where: { timestamp_lte: $endBlockTimestamp }, orderBy: timestamp, orderDirection: asc) {
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
      query ($first: Int, $skip: Int, $endBlockTimestamp: BigInt, $startBlockNumber: Int) {
          reseveRecords(first: $first, skip: $skip, block: {  number_gte: $startBlockNumber}, where: { timestamp_lte: $endBlockTimestamp }, orderBy: timestamp, orderDirection: asc) {
              id
              reserve0
              reserve1
              timestamp
          }
      }
	`,
	field: 'reseveRecords'
}

async function executeQuery(query, pageNumber = 0, pageSize = 1000) {
	const data = await client.request(query.builder, {
		first: pageSize,
		skip: pageNumber * pageSize,
		endBlockTimestamp,
		startBlockNumber,
	})
	const result = data[query.field]
	console.log({ result })
	return result
}

async function loop() {
	let output = 1;
	let page = 0;
	while (output) {
		output = await executeQuery(swapHistoryQuery, page);
		page++;
	}
}

loop();

