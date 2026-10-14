// tests/test_login.js
const { Builder, By, until } = require('selenium-webdriver');
const { expect } = require('chai');
const chrome = require('selenium-webdriver/chrome');

describe('🧪 PRUEBAS DE AUTENTICACIÓN - LoginForm', function() {
    this.timeout(30000);
    let driver;

    // Función para iniciar Chrome
    async function initDriver() {
        const options = new chrome.Options();
        options.addArguments('--start-maximized');
        return await new Builder().forBrowser('chrome').setChromeOptions(options).build();
    }

    // Login exitoso
    it('CA-LOG-01: Debe iniciar sesión con credenciales válidas (admin/admin123)', async function() {
        driver = await initDriver();
        
        await driver.get('http://localhost:5173/');
        await driver.wait(until.elementLocated(By.css('form')), 10000);
        
        await driver.findElement(By.name('username')).sendKeys('admin');
        await driver.findElement(By.name('password')).sendKeys('admin123');
        await driver.findElement(By.css('button[type="submit"]')).click();
        
        await driver.wait(until.urlContains('/home'), 15000);
        
        const currentUrl = await driver.getCurrentUrl();
        expect(currentUrl).to.include('/home');
        
        console.log('✅ Login exitoso - Redirigido a /home');
        await driver.quit();
    });

    // Campos vacíos
    it('CA-LOG-02: Debe mostrar error si usuario y contraseña están vacíos', async function() {
        driver = await initDriver();
        
        await driver.get('http://localhost:5173/');
        await driver.wait(until.elementLocated(By.css('form')), 10000);
        
        await driver.findElement(By.css('button[type="submit"]')).click();
        
        const errorMsg = await driver.wait(
            until.elementLocated(By.css('.alert-danger')),
            5000
        );
        const text = await errorMsg.getText();
        
        expect(text).to.include('complete todos los campos');
        console.log('✅ Validación campos vacíos funciona');
        await driver.quit();
    });

    // Contraseña incorrecta
    it('CA-LOG-03: Debe mostrar error con contraseña incorrecta', async function() {
        driver = await initDriver();
        
        await driver.get('http://localhost:5173/');
        await driver.wait(until.elementLocated(By.css('form')), 10000);
        
        await driver.findElement(By.name('username')).sendKeys('admin');
        await driver.findElement(By.name('password')).sendKeys('contraseñaIncorrecta');
        await driver.findElement(By.css('button[type="submit"]')).click();
        
        const errorMsg = await driver.wait(
            until.elementLocated(By.css('.alert-danger')),
            5000
        );
        const text = await errorMsg.getText();
        
        expect(text).to.include('Usuario o contraseña incorrectos');
        console.log('✅ Credenciales incorrectas rechazadas');
        await driver.quit();
    });
});