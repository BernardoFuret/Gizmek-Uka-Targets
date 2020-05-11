$( '.checkbox-legend' ).data( 'checked-next', false ).click( function( e ) {
	e.preventDefault();

	const $this = $( this );

	const checkedProp = $this.data( 'checked-next' );

	$this.siblings( '.query__form__container__fieldset-label__grouping' )
		.find( ':checkbox' )
			.prop( 'checked', checkedProp )
	;

	$this.data( 'checked-next', !checkedProp );
} );