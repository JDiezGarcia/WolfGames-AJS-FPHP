# WolfGames
***
Creator: Fco. Javier Diez Garcia

Type: CFGS Proyect

School: IES L'Estacio

Degree: Web Applications Development

# Index
***
1. [Introduction](#Introduction)
2. [Content](#Content)
    1. [Header](#Header)
    2. [Home](#Home)
    3. [Shop](#Shop)
    4. [User](#User)
    5. [Log](#Log)
    6. [Cart](#Cart)
    7. [Services](#Services)
    8. [About Us](#About%20Us)
    9. [Contact](#Contact)
    10. [Footer](#Footer)
3. [Technologies](#Technologies)
4. [Libs](#Libs)
5. [Updates](#Updates)

## Introduction
***

What is WolfGames? 

WolfGames is a student proyect, made in the first year of Web Applications Development.
Where we were building a Web Shop to "sell" games.


## Content
***
### Header

| Section | Features |
| - | - |
| Menu |  Nav menu with all the pages. |
| Logo | Favicon of the website. |
| Search | Search in the data base for products, showing a image, name and price, if you click on the image you will be going to the details of the product, if you click or press enter to search the query, if no game have that query the search bar notify you and if it has it will redirect you to the shop. |
| Language | Comming Soon.... |
| Log | Is the section where the modal opens depending of the user state if your login, it shows the logout, if your not login it show the login modal. |
| Cart | Is the button that redirects to the cart and has a counter for the total of different products |

> This section is the same in all the pages and he's features works in all of them

### Home
| Section | Features |
| - | - |
| Carousel | Products from the DB with a query that contains a offset for loading content and it show first the more visited, if you click one you go to the details of the product. |
| Categories | Show all the categories from the DB with their images and names, when you click one you are going to Shop with that category select. |

### Shop
| Section | Features |
| - | - |
| Product List | A list that is load depending of the previous action (search, carousel, category or filters. When we were over the product it will show 3 buttons that if we click it will do is action. |
| Filters | Checkboxes with a product counter, that if we uncheck it will return to the first load, if the counter is 0 it will be disable. |
| Pagination | The content is load with a offset doing the pagination depending of the total, the filters works in all the pages of the pagination. |
| Categories | All the categories that can be selected and deselect will load all the product with that category. |
| Details | If you click the button View it show a modal with a quick view, but if you click the img, it opens the view Details that shows all the data from the Product. |
| Add to Cart| Is the button that is locate in Details, modal Details and list to add a product to the cart showing a toastr message. |
| Fav | Is the button that gives a like or unlike only if you are login if your not login, a modal is open with a toastr message. |

### User
Working Progress.....

### Log
| Section | Features |
| - | - |
| Login | Modal that you can open to login with 3 option, with a local , Gmail or GitHub account.|
| Register | Other modal that open the register form with regular expressions and value validation. |
| Recover | You can put a user account that is Local to recover the pass, once the account is validate in the server, we send a message with the key code to access the password change. |
| Verify | When you register the web, we send you a email with a link, once you click it your account is validate. |
| Social Login | If you click one of the two option of social login you can access to that social network to log and get your data. |
| Token Session | Once you are login in the web you have a token that gives you access to an account.|

### Cart
| Section | Features |
| - | - |
| Add | Once you click in the add button or you login and recover the last cart the local cart change with the new and old products.|
| Recover | Once you login, the server detects if you have a open cart if not creates one empty and then retrieve the cart for you. |
| Send | Each 20 sec (Can be change) detect the local storage and send the new cart with the changes to the server to have it update.|
| Total | Calculates all the prices of the products and gives a total, for the user to see, the actual total is calculate from the DB.|
| Quantities | You can add more quantities from 2 buttons, one for add one and one for remove one or you can write it on the input (only allows positive numbers from 1 to 99) once you reach the limit the number stops. |
| Checkout | Once you click to checkout only it does the action if you are log. When you click the cart is send to update the last one and then it calculates the total and returns the information of the order.|

### Services
Working Progress.....

### About Us
| Section | Features |
| - | - |
| Geolocalitation | Comming Soon... |

### Contact
Working Progress.....

### Footer

| Section | Features |
| - | - |
| Footer | A simple footer with informacion about the company |
> This section is the same in all the pages and he's features works in all of them
![](filesREADME/short.gif)

## Technologies
***
* [PHP](https://www.php.net/manual/es/intro-whatis.php): Version 7.3.19
* [Framework Iferrer20 PHP](https://github.com/iferrer20/Autocars-PHP-Angular11): Version 1.0
* [JavaScript](https://developer.mozilla.org/es/docs/Web/JavaScript): Version ECMAScript 2016
* [SQL](https://www.mysql.com/): Version 10.3.27

## Libs
***
* [AngularJS](https://angularjs.org/): Version 1.4.9
* [AngularJS UI](https://angular-ui.github.io/): Version 2.5.0
* [AngularJS Toastr](https://www.npmjs.com/package/angularjs-toaster): Version 3.0.0
* [Firebase Auth](https://firebase.google.com/): Version 4.10.1
* [Firebase JWT](https://firebase.google.com/): Version 4.10.1
* [Bootstrap](https://getbootstrap.com/): Version 5
* [Font Awesome](https://fontawesome.com/): Version 4.7.0

## Updates
***
Coming soon Geolocalitation, More Relevant API ,Languages and Adding GITs to the README