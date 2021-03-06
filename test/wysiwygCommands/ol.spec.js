import OL from '../../src/js/wysiwygCommands/ol';
import WwTaskManager from '../../src/js/wwTaskManager';
import WwListManager from '../../src/js/wwListManager';
import WysiwygEditor from '../../src/js/wysiwygEditor';
import EventManager from '../../src/js/eventManager';

describe('OL', () => {
    let wwe, sq;

    beforeEach(() => {
        const $container = $('<div />');

        $('body').append($container);

        wwe = new WysiwygEditor($container, new EventManager());

        wwe.init();

        sq = wwe.getEditor();
        wwe.componentManager.addManager('task', WwTaskManager);
        wwe.componentManager.addManager('list', WwListManager);
        sq.focus();
    });

    //we need to wait squire input event process
    afterEach(done => {
        setTimeout(() => {
            $('body').empty();
            done();
        });
    });

    it('add OL', () => {
        const range = sq.getSelection().cloneRange();
        range.setStart(wwe.get$Body().find('div')[0], 0);
        range.collapse(true);
        sq.setSelection(range);
        OL.exec(wwe);

        expect(wwe.get$Body().find('ol').length).toEqual(1);
        expect(wwe.get$Body().find('li').length).toEqual(1);
    });

    it('if have task in range then remove task and change to ul', () => {
        const range = sq.getSelection().cloneRange();

        sq.setHTML('<ul><li data-te-task class="task-list-item"><div>test</div></li></ul>');

        range.setStart(wwe.get$Body().find('li div')[0].firstChild, 1);
        range.collapse(true);

        sq.setSelection(range);

        OL.exec(wwe);

        expect(wwe.get$Body().find('ul').length).toEqual(0);
        expect(wwe.get$Body().find('ol li.task-list-item[data-te-task]').length).toEqual(1);
        expect(wwe.get$Body().find('ol').length).toEqual(1);
        expect(wwe.get$Body().find('li').length).toEqual(1);
        expect(wwe.get$Body().find('li').text()).toEqual('test');
    });

    it('add OL with selection', () => {
        const $body = sq.get$Body();
        const $div1 = $('<div>hello</div>');
        const $div2 = $('<div>world</div>');
        const $div3 = $('<div>i`m</div>');
        const $div4 = $('<div>fine</div>');

        $body.append($div1);
        $body.append($div2);
        $body.append($div3);
        $body.append($div4);

        const range = sq.getSelection();
        range.setStart($div1[0], 0);
        range.setEnd($div4[0], 1);
        sq.setSelection(range);

        OL.exec(wwe);

        expect(wwe.get$Body().find('ol').length).toEqual(1);
        expect(wwe.get$Body().find('li').length).toEqual(4);
    });

    it('add OL with selection ol within', () => {
        const $body = sq.get$Body();
        const $div1 = $('<div>hello</div>');
        const $div2 = $('<div>world</div>');
        const $div3 = $('<div>i`m</div>');
        const $ol = $('<ol><li><div>fine</div></li></ol>');

        $body.append($div1);
        $body.append($div2);
        $body.append($div3);
        $body.append($ol);

        const range = sq.getSelection();

        range.setStart($div1[0], 0);
        range.setEnd($ol.find('li').eq(0)[0], 1);
        sq.setSelection(range);

        OL.exec(wwe);

        expect(wwe.get$Body().find('ol').length).toEqual(1);
        expect(wwe.get$Body().find('li').length).toEqual(4);
    });

    it('do not convert next element of OL with selection start ol within', () => {
        const $body = sq.get$Body();
        const $div1 = $('<div>hello</div>');
        const $div2 = $('<div>world</div>');
        const $div3 = $('<div>i`m</div>');
        const $ol = $('<ol><li><div>fine</div></li></ol>');

        $body.append($ol);
        $body.append($div1);
        $body.append($div2);
        $body.append($div3);

        const range = sq.getSelection();

        range.setStart($ol.find('li div')[0].firstChild, 0);
        range.setEnd($div3[0], 1);
        sq.setSelection(range);

        OL.exec(wwe);

        expect(wwe.get$Body().find('ol').length).toEqual(1);
        expect(wwe.get$Body().find('li').length).toEqual(1);
    });

    it('change UL to OL', () => {
        const $body = sq.get$Body();
        const $ul = $('<ul><li><div>fine</div></li></ul>');

        $body.append($ul);

        const range = sq.getSelection();

        range.setStart($ul[0].firstChild.firstChild.firstChild, 1);
        range.collapse(true);
        sq.setSelection(range);

        OL.exec(wwe);

        expect(wwe.get$Body().find('ol').length).toEqual(1);
        expect(wwe.get$Body().find('li').length).toEqual(1);
    });

    it('change UL to OL with selection', () => {
        const $body = sq.get$Body();
        const $ul = $('<ul><li><div>fine</div></li><li><div>thank you</div></li></ul>');

        $body.append($ul);

        const range = sq.getSelection();

        range.setStart($ul.find('li div')[0].firstChild, 1);
        range.setEnd($ul.find('li div')[0].firstChild, 1);
        sq.setSelection(range);

        OL.exec(wwe);

        expect(wwe.get$Body().find('ol').length).toEqual(1);
        expect(wwe.get$Body().find('li').length).toEqual(2);
    });

    it('change TASK to OL', () => {
        const $body = sq.get$Body();
        const $ul = $('<ul><li class="task-list-item"><div>fine</div></li></ul>');

        $body.append($ul);

        const range = sq.getSelection();

        range.setStart($ul[0].firstChild.firstChild.firstChild, 1);
        range.collapse(true);
        sq.setSelection(range);

        OL.exec(wwe);

        expect(wwe.get$Body().find('ol').length).toEqual(1);
        expect(wwe.get$Body().find('li.task-list-item').length).toEqual(1);
        expect(wwe.get$Body().find('li').length).toEqual(1);
    });

    it('change TASK to OL with selection', () => {
        const $body = sq.get$Body();
        const $ul = $('<ul><li class="task-list-item"><div>fine</div></li><li class="task-list-item"><div>thank you</div></li></ul>');

        $body.append($ul);

        const range = sq.getSelection();

        range.setStart($body.find('ul>li>div').eq(0)[0], 0);
        range.setEnd($body.find('ul>li>div').eq(1)[0], 1);
        sq.setSelection(range);

        OL.exec(wwe);

        expect(wwe.get$Body().find('ol').length).toEqual(1);
        expect(wwe.get$Body().find('li.task-list-item').length).toEqual(2);
        expect(wwe.get$Body().find('li').length).toEqual(2);
    });

    it('stop changing format to OL when meet PRE, TABLE element', () => {
        const $body = sq.get$Body();
        const $div1 = $('<div>fine</div>');
        const $div2 = $('<div>thank you</div>');
        const $pre = $('<pre>haha</pre>');
        const $div3 = $('<div>me too</div>');

        $body.append($div1);
        $body.append($div2);
        $body.append($pre);
        $body.append($div3);

        const range = sq.getSelection();

        range.setStart($div1[0], 0);
        range.setEnd($div3[0], 1);
        sq.setSelection(range);

        OL.exec(wwe);

        expect(wwe.get$Body().find('ol').length).toEqual(1);
        expect(wwe.get$Body().children('pre').length).toEqual(1);
        expect(wwe.get$Body().find('li').length).toEqual(2);
    });
});
