const { gql, GraphQLClient } =  require('graphql-request')

const client = new GraphQLClient('https://api.thegraph.com/subgraphs/name/mohandesjiri/jiri-uniswap-analysis')
//todo
const endBlockTimestamp = "123456"

const mintHistoryQuery = {
	builder: gql`
      query ($first: Int, $skip: Int, $timestampCutoff: BigInt) {
          mintRecords(first: $first, skip: $skip, where: { timestamp_lte: $timestampCutoff }, orderBy: timestamp, orderDirection: asc) {
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
      query ($first: Int, $skip: Int, $timestampCutoff: BigInt) {
          burnRecords(first: $first, skip: $skip, where: { timestamp_lte: $timestampCutoff }, orderBy: timestamp, orderDirection: asc) {
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
      query ($first: Int, $skip: Int, $timestampCutoff: BigInt) {
          swapRecords(first: $first, skip: $skip, where: { timestamp_lte: $timestampCutoff }, orderBy: timestamp, orderDirection: asc) {
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
      query ($first: Int, $skip: Int, $timestampCutoff: BigInt) {
          reseveRecords(first: $first, skip: $skip, where: { timestamp_lte: $timestampCutoff }, orderBy: timestamp, orderDirection: asc) {
              id
              reserve0
              reserve1
              timestamp
          }
      }
	`,
	field: 'reseveRecords'
}

async function executeQuery(query, pageNumber = 0, pageSize = 10) {
	const data = await client.request(query.builder, {
		first: pageSize,
		skip: pageNumber * pageSize,
		timestampCutoff: endBlockTimestamp,
	})
	const result = data[query.field]
	console.log({ result })
	return result
}

executeQuery(reserveHistoryQuery);
