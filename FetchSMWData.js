/**
 * For MW environment. Grab all "Gizmek Inari, the Grain Storage Fox" targets
 * (https://yugipedia.com/wiki/Gizmek_Inari,_the_Grain_Storage_Fox)
 * @author Becasita
 */
async function getSameATKDEF() {
	const STATS = [
		0, 100, 150, 200, 250, 300, 350, 400, 450, 500,550, 600, 650, 666, 700, 750, 800, 850, 900, 920, 950,
		1000, 1050, 1100, 1150, 1200, 1250, 1300, 1350, 1380, 1400, 1450, 1460, 1500, 1530, 1550, 1600, 1610, 1650, 1700, 1750, 1800, 1850, 1900, 1930, 1950,
		2000, 2050, 2100, 2150, 2200, 2250, 2300, 2350, 2400, 2450, 2500, 2510, 2550, 2600, 2650, 2700, 2750, 2800, 2850, 2900, 2950,
		3000, 3100, 3200, 3300, 3400, 3450, 3500, 3600, 3700, 3750, 3800,
		4000, 4200, 4400, 4500, 4600,
		5000
	];

	const monsters = [];

	const api = await mw.loader.using( 'mediawiki.api' ).then( () => new mw.Api() );

	for ( const stat of STATS ) {
		const response = await api.get( {
			action: 'ask',
			query: `[[Medium::TCG||OCG]] [[ATK string::${stat}]] [[DEF string::${stat}]] [[Belongs to::Main Deck]] |?Attribute|?Type|?Stars string|?Summoning|?Primary type| limit = 500`,
		} );

		Object.entries( response.query.results ).forEach( ( [ monster, { printouts } ] ) => {
			if (
				printouts.Summoning.some( c => c.match( /nomi\b/i ) )
				||
				printouts[ 'Primary type' ].some( t => t.fulltext.match( /ritual/i ) )
			) {
				console.log( 'Filtering', monster );

				return;
			}
			
			console.log( 'Pushing', monster );
		
			monsters.push( {
				name: monster,
				atkDef: stat,
				attribute: ( printouts.Attribute[ 0 ] || {} ).fulltext,
				type: ( printouts.Type[ 0 ] || {} ).fulltext,
				level: printouts[ 'Stars string' ][ 0 ],
				ssFromDeck: !printouts.Summoning.includes( 'Cannot be Special Summoned from the Deck' ),
			} );
		} );
	}

	console.log( 'Done' );

	window[ `__monsters${Date.now().toString( 36 )}` ] = monsters;
}