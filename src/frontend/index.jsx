import React, { useEffect, useState } from 'react';
import ForgeReconciler, { Text, Strong, Lozenge, Inline } from '@forge/react';
import { invoke } from '@forge/bridge';

const App = () => {
	const [company, setCompany] = useState(null);

	useEffect(async () => {
		let companyId = await invoke('getCompanyId');

		invoke('getCompanyTypes', { companyId }).then(setCompany);
	}, []);

	const hasValidType = company?.types?.some((type) => [55, 56, 57].includes(type.id));

	return (
		<>
			{hasValidType && (
				<Text>
					<Strong>Client Stoplight: </Strong>
					{company?.types?.some((type) => type.id === 57) && <Lozenge appearance='success'>GREEN</Lozenge>}
					{company?.types?.some((type) => type.id === 56) && <Lozenge appearance='removed'>RED</Lozenge>}
					{company?.types?.some((type) => type.id === 55) && <Lozenge appearance='moved'>YELLOW</Lozenge>}
				</Text>
			)}
		</>
	);
};

ForgeReconciler.render(
	<React.StrictMode>
		<App />
	</React.StrictMode>
);
