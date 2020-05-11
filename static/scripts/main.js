( ( window, $, console ) => {
	const MIN_ATK_DEF = 0;

	const MAX_ATK_DEF = 5000;

	const LABELS = {
		name: 'Name',
		atkDef: 'ATK / DEF',
		level: 'Level',
		attribute: 'Attribute',
		type: 'Type',
		ssFromDeck: 'Can be Special Summoned from Deck',
	};

	const checkedValues = ( acc, el ) => el.checked ? acc.concat( el.value ) : acc;

	function getMinMaxAtkDef() {
		let min = $( '#query--atk-def--min' ).val();

		let max = $( '#query--atk-def--max' ).val();

		if ( min === '' && max === '' ) {
			return {
				min: MIN_ATK_DEF,
				max: MAX_ATK_DEF,
			};
		}

		min = Number( min !== '' ? min : max );

		max = Number( max !== '' ? max : min );

		if ( min > max ) {
			[ min, max ] = [ max, min ];
		}

		return {
			min, max,
		};
	}

	function makeTdClass( label ) {
		return `data--${label.replace( /\/| /g, '' ).toLowerCase()}`;
	}

	function sortTable( label, asc, isNumber ) { // NOTE: Follow table presentation logic vs. arrows.
		return e => {
			e.preventDefault();

			const $cells = $( '#query-results tbody' );

			$cells.find( 'tr' )
				.sort( ( r1, r2 ) => {
					const cssClass = `.${makeTdClass( label )}`;

					const $data1 = $( r1 ).find( cssClass ).text();
					const $data2 = $( r2 ).find( cssClass ).text();

					if ( isNumber ) {
						return asc
							? Number( $data1 ) - Number( $data2 )
							: Number( $data2 ) - Number( $data1 )
						;
					} else {
						return asc //(a.attr > b.attr) - (a.attr < b.attr)
							? $data1.localeCompare( $data2 )
							: $data2.localeCompare( $data1 )
						;
					}
				} )
				.each( ( i, tr ) => {
					$( tr ).appendTo( $cells );
				} )
			;
		};
	}

	function makeHeaderCell( label, isNumber ) {
		return $( '<th>' )
			.append( $( '<span>', {
				text: label,
			} ) )
			.append( $( '<a>' , {
				class: 'asc',
				href: '#',
				html: '&uarr;',
				click: sortTable( label, false, isNumber ),
			} ) )
			.append( $( '<a>' , {
				class: 'desc',
				href: '#',
				html: '&darr;',
				click: sortTable( label, true, isNumber ),
			} ) )
		;
	}

	function printResults( results ) {
		if ( !results.length ) {
			$( '#results-container' ).html( $( '<strong>', {
				text: 'No results found!',
			} ) );

			return;
		}

		const $table = $( '<table>', {
			id: 'query-results',
		} );

		const $thead = $( '<thead>' )
			.appendTo( $table )
		;

		const $tbody = $( '<tbody>' )
			.appendTo( $table )
		;

		$( '<tr>' )
			.append( makeHeaderCell( LABELS.name ) )
			.append( makeHeaderCell( LABELS.atkDef, true ) )
			.append( makeHeaderCell( LABELS.level, true ) )
			.append( makeHeaderCell( LABELS.attribute ) )
			.append( makeHeaderCell( LABELS.type ) )
			.append( makeHeaderCell( LABELS.ssFromDeck ) )
			.appendTo( $thead )
		;

		results.forEach( monster => {
			$( '<tr>' )
				// Name:
				.append( $( '<td>', {
					class: makeTdClass( LABELS.name ),
				} )
					.append( '"' )
					.append( $( '<a>', {
						href: `https://yugipedia.com/wiki/${monster.name}`,
						target: '_blank',
						rel: 'noopener noreferrer',
						text: monster.name.split( ' (' )[ 0 ],
					} ) )
					.append( '"' )
				 )
				// ATK / DEF:
				.append( $( '<td>', {
					class: makeTdClass( LABELS.atkDef ),
					'data-isNumber': true,
					text: monster.atkDef,
				} ) )
				// Level:
				.append( $( '<td>', {
					class: makeTdClass( LABELS.level ),
					'data-isNumber': true,
					text: monster.level,
				} ) )
				// Attribute:
				.append( $( '<td>', {
					class: makeTdClass( LABELS.attribute ),
					text: monster.attribute,
				} ) )
				// Type:
				.append( $( '<td>', {
					class: makeTdClass( LABELS.type ),
					text: monster.type,
				} ) )
				// Summon from Deck:
				.append( $( '<td>', {
					class: makeTdClass( LABELS.ssFromDeck ),
					html: monster.ssFromDeck ? '&#10004;' : '&#10060;',
				} ) )
				.appendTo( $tbody )
			;
		} );

		$( '#results-container' ).html( '' )
			.append( $( '<strong>', {
				text: `Found ${results.length} monsters.`,
			} ) )
			.append( $table )
		;
	}

	$( '#query-options' ).removeAttr( 'onclick' ).off( 'click' ).click( e => {
		e.preventDefault();

		const jsQuery = {
			atkDef: getMinMaxAtkDef(),
			level: $( '#query__form__container--level .query--level' )
				.toArray()
					.reduce( checkedValues, [] ),
			attribute: $( '#query__form__container--attribute .query--attribute' )
				.toArray()
					.reduce( checkedValues, [] ),
			type: $( '#query__form__container--type .query--type' )
				.toArray()
					.reduce( checkedValues, [] ),
			includeSSFromDeck: $( '#query--special-summon-from-deck' ).is( ':checked' ),
		};

		const results = YUGIPEDIA_DATA.filter( monster => {
			return (
				( jsQuery.atkDef.min <= monster.atkDef && monster.atkDef <= jsQuery.atkDef.max )
				&&
				jsQuery.level.includes( monster.level )
				&&
				jsQuery.attribute.includes( monster.attribute )
				&&
				jsQuery.type.includes( monster.type )
				&&
				( jsQuery.includeSSFromDeck ? true : monster.ssFromDeck )
			);
		} );

		printResults( results );

	} );
} )( window, window.jQuery, window.console );