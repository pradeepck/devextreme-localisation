import React from 'react';
import DataGrid, { Column, Editing, FilterRow } from 'devextreme-react/data-grid';
import { SelectBox } from 'devextreme-react';

import 'devextreme/localization/globalize/number';
import 'devextreme/localization/globalize/date';
import 'devextreme/localization/globalize/currency';
import 'devextreme/localization/globalize/message';

import * as deMessages from 'devextreme/localization/messages/de.json';
import * as ruMessages from 'devextreme/localization/messages/ru.json';

import * as deCldrData from 'devextreme-cldr-data/de.json';
import * as ruCldrData from 'devextreme-cldr-data/ru.json';
import * as supplementalCldrData from 'devextreme-cldr-data/supplemental.json';

import Globalize from 'globalize';

import service from './data.js';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      locale: this.getLocale()
    };
    this.locales = service.getLocales();
    this.payments = service.getPayments();
    this.initGlobalize();
    this.changeLocale = this.changeLocale.bind(this);
  }
  getLocale() {
    const locale = sessionStorage.getItem('locale');
    return locale != null ? locale : 'en';
  }
  setLocale(locale) {
    sessionStorage.setItem('locale', locale);
  }
  initGlobalize() {
    Globalize.load(
      deCldrData,
      ruCldrData,
      supplementalCldrData
    );
    Globalize.loadMessages(deMessages);
    Globalize.loadMessages(ruMessages);
    Globalize.loadMessages(service.getDictionary());
    Globalize.locale(this.state.locale);
  }
  changeLocale(e) {
    this.setState({
      locale: e.value
    });
    this.setLocale(e.value);
    window.location.href = window.location.href;
  }
  render() {
    return (
      <div>
        <DataGrid dataSource={this.payments}
          keyExpr={'PaymentId'}>
          <Editing mode={'popup'}
            allowUpdating={true}
            popup={{
              width:700,
              height:345
            }} />
          <FilterRow visible={true}
            applyFilter={'auto'} />
          <Column dataField={'PaymentId'}
            caption={Globalize.formatMessage('Number')}
            allowEditing={false}
            width={100} />
          <Column dataField={'ContactName'}
            caption={Globalize.formatMessage('Contact')} />
          <Column dataField={'CompanyName'}
            caption={Globalize.formatMessage('Company')} />
          <Column dataField={'Amount'}
            caption={Globalize.formatMessage('Amount')}
            dataType={'number'}
            format={'currency'}
            editorOptions={{
              format: 'currency',
              showClearButton: true
            }} />
          <Column dataField={'PaymentDate'}
            caption={Globalize.formatMessage('PaymentDate')}
            dataType={'date'} />
        </DataGrid>
        <div className={'options'}>
          <div className={'caption'}>Options</div>
          <div className={'option'}>
            <label htmlFor={'selectInput'}>Language</label>
            &nbsp;
            <SelectBox items={this.locales}
              valueExpr={'Value'}
              displayExpr={'Name'}
              value={this.state.locale}
              onValueChanged={this.changeLocale}
              inputAttr={{ id: 'selectInput' }} />
          </div>
        </div>
      </div>
    );
  }
}

export default App;
