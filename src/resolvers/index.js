import Resolver from '@forge/resolver';
import api, { route, fetch, properties } from '@forge/api';

const COMPANY_ID_KEY = 'company-id';

const resolver = new Resolver();

resolver.define('getCompanyId', async (req) => {
	const { id } = req.context.extension.content;

	const companyId = await properties.onConfluencePage(`${id}`).get(COMPANY_ID_KEY);

	if (companyId) return companyId;

	const response = await api.asUser().requestConfluence(route`/wiki/api/v2/pages/${id}`, {
		headers: {
			Accept: 'application/json',
		},
	});

	const { title } = await response.json();

	const splitTitle = title.split('-');
	const identifier = splitTitle[0].trim();

	const result = await fetch(
		`${process.env.API_ENDPOINT}/company/companies?conditions=identifier='${identifier}'&fields=id`,
		{
			headers: {
				clientId: process.env.CLIENT_ID,
				Authorization: `Basic ${process.env.AUTH_CODE}`,
			},
		}
	);

	const data = await result.json();

	await properties.onConfluencePage(`${id}`).set(COMPANY_ID_KEY, data[0]?.id);

	return data[0]?.id;
});

resolver.define('getCompanyTypes', async (req) => {
	const { companyId } = req.payload;

	const result = await fetch(`${process.env.API_ENDPOINT}/company/companies/${companyId}?fields=types`, {
		headers: {
			clientId: process.env.CLIENT_ID,
			Authorization: `Basic ${process.env.AUTH_CODE}`,
		},
	});

	return await result.json();
});

export const handler = resolver.getDefinitions();
