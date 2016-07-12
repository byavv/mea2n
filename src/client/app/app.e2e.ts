describe('App', () => {
    beforeEach(() => {
        browser.get('/');
    });

    it('should have a title', () => {
        var subject = browser.getTitle();
        var result = 'MEA(2)N';
        expect(subject).toEqual(result);
    });

    it('should have <header>', () => {
        var subject = element(by.css('app-header')).isPresent();       
        expect(subject).toEqual(true);
    });
});